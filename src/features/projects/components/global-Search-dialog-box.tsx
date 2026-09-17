import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { useFiles } from "../hooks/use-file";
import { Id } from "../../../../convex/_generated/dataModel";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import { FileIcon } from "lucide-react";

export const GlobalSearchDialogBox = ({ projectId }: { projectId: Id<'projects'> }) => {
    const files = useFiles(projectId);
    const isOpen = useEditorStore((state) => state.isQuickOpenBoxOpen);
    const setIsOpen = useEditorStore((state) => state.setIsQuickOpenBoxOpen);
    const openFile = useEditorStore((state) => state.openFile);

    return (
        <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
            <CommandInput placeholder="Search files in project..." />
            <CommandList>
                <CommandEmpty>No files found.</CommandEmpty>
                <CommandGroup heading="Files">
                    {files?.map((file) => (
                        <CommandItem
                            key={file._id}
                            value={file.name}
                            onSelect={() => {
                                openFile(projectId, file._id, { pinned: true });
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <FileIcon className="size-4 text-muted-foreground" />
                            <span>{file.name}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};