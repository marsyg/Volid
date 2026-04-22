import {FileIcon ,FolderIcon} from "@react-symbols/icons/utils"
import { ChevronRightIcon } from "lucide-react"
import { useState } from "react"
import { getItemPadding } from './constant'


export const CreateInput = ({  
    type,
    level,
    onSubmit,
    onCancel,
}: {

    type: "file" | "folder"| null,
    level: number
    onSubmit: (name: string) => void
    onCancel: () => void
}) => {

    const [value, setValue] = useState("");

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) {
            handleCancel();
            return;
        }
        onSubmit(trimmed);
        setValue("");
    };

    const handleCancel = () => {
        setValue("");
        onCancel();
    };


    const placeholder = type === "file" ? "Enter file name" : "Enter folder name";
    const containerStyle: React.CSSProperties = { paddingLeft: getItemPadding(level , type === "file") };

    return (
          <div
          
            onSubmit={handleSubmit}
            className="w-full flex items-center gap-1 h-5.5 bg-accent/30"
            style={containerStyle}
        >
            <div className="flex items-center gap-0.5">
              {type === "folder" && <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground"/>}
              {type === "file" && <FileIcon fileName={value} className="size-4" autoAssign />}
              {type === "folder" && <FolderIcon folderName={value}  className="size-4" />}
            </div>

            <input
                autoFocus 
                type="text"
                  
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        e.preventDefault();
                        handleCancel();
                    }
                }}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none text-sm"
                onBlur={handleSubmit}
            />

          </div>
    );
}