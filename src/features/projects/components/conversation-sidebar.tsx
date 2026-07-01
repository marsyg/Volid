'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { BotIcon, ChevronDown, PaperclipIcon, SendIcon, SparklesIcon } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { ContextMenu } from './conversationSidebar/ContextMenu';
import { ACCESS_OPTIONS, MODEL_OPTIONS } from './conversationSidebar/constant';
import { CustomSelect } from './conversationSidebar/customSelect';

export const ConversationSidebar = ({ projectId }: { projectId: Id<'projects'> }) => {
  const [model, setModel] = useState(MODEL_OPTIONS[0].label);
  const [context, setContext] = useState('');
  const [access, setAccess] = useState(ACCESS_OPTIONS[0].label);
  const [prompt, setPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const messages = useQuery(api.agentMemory.getRecentMessagesForCurrentUser, {
    projectId,
    limit: 50,
  });
  const runs = useQuery(api.agentRun.getRecentAgentRunsForCurrentUser, {
    projectId,
    limit: 10,
  });

  const activeRun = runs?.[0];
  const isRunning =
    isSending || activeRun?.status === 'pending' || activeRun?.status === 'running';

  const submitPrompt = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isSending) return;

    setIsSending(true);
    setSendError(null);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmedPrompt, projectId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Failed to start agent run');
      }

      setPrompt('');
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Failed to start agent run');
    } finally {
      setIsSending(false);
    }
  };

  const visibleMessages = messages?.filter((message) => message.role !== 'tool') ?? [];

  return (
    <aside className="flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground">
      <header className="flex h-12 shrink-0 items-center justify-between border-b px-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
            <BotIcon className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-medium">Conversation</h2>
            <p className="truncate text-xs text-muted-foreground">AI coding assistant</p>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="New conversation">
          <SparklesIcon className="size-4" />
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <Separator />

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
          {visibleMessages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
              Ask about the codebase, request edits, or attach files as context.
            </div>
          ) : (
            visibleMessages.map((message) => (
              <div
                key={message._id}
                className={
                  message.role === 'user'
                    ? 'ml-6 rounded-md border bg-background p-3 text-sm'
                    : 'mr-6 rounded-md border bg-muted/40 p-3 text-sm'
                }
              >
                <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                  {message.role === 'assistant'
                    ? 'Agent'
                    : message.role === 'system'
                      ? 'System'
                      : 'You'}
                </div>
                <div className="whitespace-pre-wrap break-words leading-6">
                  {message.content}
                </div>
              </div>
            ))
          )}

          {isRunning ? (
            <div className="mr-6 rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
              {activeRun?.status === 'running' ? 'Agent is working...' : 'Agent run queued...'}
            </div>
          ) : null}

          {activeRun?.status === 'failed' && activeRun.error ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {activeRun.error}
            </div>
          ) : null}

          {sendError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {sendError}
            </div>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 border-t p-3">
        <div className="rounded-md border bg-background shadow-xs">
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void submitPrompt();
              }
            }}
            placeholder="Ask AI to edit or explain code..."
            className="min-h-24 resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0"
          />
          <div className="m-2 flex  items-center justify-between gap-2">
            <div className="flex  flex-wrap justify-between w-full">
              <div className="flex items-center justify-around">
                <ContextMenu
                  className="mr-2 h-7! border-0"
                  value=""
                  icons={PaperclipIcon}
                  placeholder=""
                  projectId={projectId}
                  onChange={setContext}
                />
              </div>
              <div className=" flex items-center my-2 overflow-hidden">
                <CustomSelect
                  className="mr-2 h-7! border-0"
                  value={model}
                  onChange={setModel}
                  options={MODEL_OPTIONS}
                  placeholder="Model"
                  icons={ChevronDown}
                />

                <CustomSelect
                  className=" mr-2 h-7! border-0 "
                  value={access}
                  onChange={setAccess}
                  options={ACCESS_OPTIONS}
                  placeholder="Access"
                  icons={ChevronDown}
                />

                <Button
                  className="size-6.5"
                  disabled={!prompt.trim() || isSending}
                  onClick={() => void submitPrompt()}
                  aria-label="Send message"
                >
                  <SendIcon className="" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
