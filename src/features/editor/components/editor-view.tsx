
// src/features/editor/components/editor-view.tsx
import Image from "next/image";
import { useEffect, useRef } from "react";

import { useFile, useUpdateFile } from "../../projects/hooks/use-file";
import { CodeEditor } from "./code-editor";
import { useEditorStore } from "../store/useEditorStore";

import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangleIcon } from "lucide-react";

const DEBOUNCE_MS = 1500;

const noActiveTabView = () => {
    
    return (
      
      <div className="size-full flex items-center justify-center">
        <Image
          src="/logo-alt.svg"
          alt="Polaris"
          width={50}
          height={50}
          className="opacity-25"
        />
      </div>
        
    )
}
export const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { tabs } = useEditorStore();
    const activeTabId = tabs.get(projectId)?.activeTabId     
    
    
    const activeFile = useFile(activeTabId ?? undefined ,projectId);
    const updateFile = useUpdateFile();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
   
    const isActiveFileBinary = activeFile && activeFile.storageID;
    const isActiveFileText = activeFile && !activeFile.storageID;

    // Cleanup pending debounced updates
      useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeTabId]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center">
       
      </div>
    
      <div className="flex-1 min-h-0 bg-background overflow-hidden">
        {!activeFile && (
          <div className="size-full flex items-center justify-center">
            <Image
              src="/logo-alt.svg"
              alt="Polaris"
              width={50}
              height={50}
              className="opacity-25"
            />
          </div>
        )}
        {isActiveFileText && (
          <CodeEditor
            key={activeFile._id}
            fileName={activeFile.name}
            intailValue={activeFile.content}
            onChange={(content: string) => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }

              timeoutRef.current = setTimeout(() => {
                updateFile({ fileId: activeFile._id, content });
              }, DEBOUNCE_MS);
            }}
          />
        )}
        {isActiveFileText && (
          <div className="size-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2.5 max-w-md text-center">
              <AlertTriangleIcon className="size-10 text-yellow-500" />
              <p className="text-sm">
                The file is not displayed in the text editor because it is either binary or uses an unsupported text encoding.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};