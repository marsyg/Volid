import * as Monaco from "monaco-editor";
import { safeAsync } from "./safeErrorLogging";

const INLINE_COMPLETION_DEBOUNCE_MS = 250;
const INLINE_COMPLETION_TIMEOUT_MS = 120000;

function waitForInlineCompletionRequest(token: Monaco.CancellationToken) {
  return new Promise<boolean>((resolve) => {
    const timeout = setTimeout(() => resolve(true), INLINE_COMPLETION_DEBOUNCE_MS);

    token.onCancellationRequested(() => {
      clearTimeout(timeout);
      resolve(false);
    });
  });
}

export function createMyInlineCompletionsProvider(): Monaco.languages.InlineCompletionsProvider {
    console.log("createMyInlineCompletionsProvider Called")
  return {
    
    async provideInlineCompletions(model, position, context, token ) {     
          
      const startLine = Math.max(1, position.lineNumber - 20);
      const endLine = Math.min(model.getLineCount(), position.lineNumber + 20);
      const textBeforeCursor = model.getValueInRange({
        startLineNumber: startLine,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const textAfterCursor = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: endLine,
        endColumn: model.getLineMaxColumn(endLine),
      });
    
      const languageId = model.getLanguageId()
    // token.isCancellationRequested — check this before expensive ops
    if (token.isCancellationRequested) return { items: [] };

      const shouldRequestCompletion = await waitForInlineCompletionRequest(token);
      if (!shouldRequestCompletion || token.isCancellationRequested) return { items: [] };
      
     return  safeAsync(async () => {
        const controller = new AbortController();
        token.onCancellationRequested(() => controller.abort());
        const timeOut = setTimeout(() => {
          controller.abort();
        }, INLINE_COMPLETION_TIMEOUT_MS);
      
        try {
          const res = await fetch("/api/inline-completion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code: {
                beforeCursor: textBeforeCursor,
                afterCursor: textAfterCursor,
              },
              position,
              languageId,
            }),
            signal: controller.signal,
          });

          if (!res.ok) {
            console.error("Inline completion request failed", {
              status: res.status,
              body: await res.text(),
            });
            return { items: [] };
          }

          return await res.json();
        } finally {
          clearTimeout(timeOut);
        }
      }, { items: [] });

          
    },

    // REQUIRED: called when Monaco is done with a completions list
    disposeInlineCompletions(completions, reason) {
      // cleanup if needed, often a no-op
    },

    // OPTIONAL: called when an item is shown to the user
    handleItemDidShow(completions, item, updatedInsertText, editDeltaInfo) {
      console.log("Item shown:", updatedInsertText);
    },

    // OPTIONAL: called when user partially accepts (Tab through word-by-word)
    handlePartialAccept(completions, item, acceptedCharacters, info) {
      console.log("Partial accept, chars:", info.acceptedLength);
    },

    // OPTIONAL: called when an item's lifetime ends (accepted, rejected, expired)
    handleEndOfLifetime(completions, item, reason, lifetimeSummary) {
      console.log("End of lifetime, reason:", reason);
    },
  };
}
