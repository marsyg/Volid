'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  BotIcon,
  BracesIcon,
  FolderPlusIcon,
  PaperclipIcon,
  SendIcon,
  SparklesIcon,
} from 'lucide-react';

const contextItems = ['Current file', 'Open tabs', 'Project tree'];

export const ConversationSidebar = () => {
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
        <div className="space-y-3 p-3">
          <Select defaultValue="auto">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="fast">Fast</SelectItem>
              <SelectItem value="reasoning">Reasoning</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="w-full justify-start">
            <FolderPlusIcon className="size-4" />
            Add context
          </Button>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <BracesIcon className="size-3.5" />
              Context
            </div>
            <div className="flex flex-wrap gap-1.5">
              {contextItems.map((item) => (
                <span
                  key={item}
                  className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-1 items-center justify-center  text-center text-sm text-muted-foreground">
          Ask about the codebase, request edits, or attach files as context.
        </div>
      </div>

      <div className="shrink-0 border-t p-3">
        <div className="rounded-md border bg-background    shadow-xs">
          <Textarea
            placeholder="Ask AI to edit or explain code..."
            className="min-h-24 resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0"
          />
          <div className="m-2 flex items-center justify-between gap-2">
            <div className="flex justify-between w-full">
              <div className="flex">
                <Button variant="ghost" size="icon-sm" aria-label="Attach context">
                  <PaperclipIcon className="size-4" />
                </Button>
              </div>
              <div className=" flex items-center ">
                <Button className="h-7 p-2 m-0.5" variant="ghost">
                  Model
                </Button>
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
