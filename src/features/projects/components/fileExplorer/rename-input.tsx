import { useState } from "react";
import { getItemPadding } from "./constant";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const RenameInput = (
    { type,
        isActive,
      level,
      defaultValue,
      onSubmit,
      onCancel
    }: {
    type: "file" | "folder";
    isActive: boolean;
    level: number;
    defaultValue: string;
    onSubmit: (name: string) => void;
    onCancel: () => void;
        }) => {
    
    const [value, setValue] = useState(defaultValue);
    
    const handleSubmit = () => {
        const trimmedValue = value.trim()|| defaultValue;
        onSubmit(trimmedValue);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="w-full flex items-center gap-1  h-5.5  bg-accent/30"
            style={{ paddingLeft: getItemPadding(level + 1, type === "file") }}>
            <div className="flex item-center gap-0.5">
                {
                    type === "folder" && (
                        <  ChevronRightIcon className={cn("size-4 shrink-0 text-muted-foreground", isActive && "rotate-90")} />
                  )
                }
                {
                    type === "file" && (
                        <FileIcon className={cn("size-4 shrink-0 text-muted-foreground")} />
                    )
                }
                {
                    type === "folder" && (
                        <FolderIcon className={cn("size-4 shrink-0 text-muted-foreground")} />
                    )
                }
                <input
                    autoFocus
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                        if (e.key === "Escape") handleCancel();
                    }}
                    onBlur={handleSubmit}
                    onFocus={(e) => {
                            if (type === "folder") {
                              e.currentTarget.select();
                            } else {
                              const value = e.currentTarget.value;
                              const lastDotIndex = value.lastIndexOf(".");
                              if (lastDotIndex > 0) {
                                e.currentTarget.setSelectionRange(0, lastDotIndex);
                              } else {
                                e.currentTarget.select();
                              }
                            }
                          }}
                    className="flex-1 text-sm text-foreground bg-transparent outline-none"
                />
            </div>
        </div>
    );
};