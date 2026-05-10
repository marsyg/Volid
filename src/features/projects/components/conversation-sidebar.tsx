'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { BotIcon, ChevronDown, PaperclipIcon, SendIcon, SparklesIcon } from 'lucide-react';
import { useState } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { ContextMenu } from './conversationSidebar/ContextMenu';
import { ACCESS_OPTIONS, MODEL_OPTIONS } from './conversationSidebar/constant';
import { CustomSelect } from './conversationSidebar/customSelect';

const contextItems = ['Current file', 'Open tabs', 'Project tree'];
export const ConversationSidebar = ({ projectId }: { projectId: Id<'projects'> }) => {
  const [model, setModel] = useState(MODEL_OPTIONS[0].label);
  const [context, setContext] = useState('');
  const [access, setAccess] = useState(ACCESS_OPTIONS[0].label);

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

        <div className="flex flex-1 items-center justify-center  text-center text-sm text-muted-foreground">
          Ask about the codebase, request edits, or attach files as context.
        </div>
      </div>

      <div className="shrink-0 border-t p-3">
        <div className="rounded-md border bg-background shadow-xs">
          <Textarea
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

                <Button className="size-6.5" disabled={true}>
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
