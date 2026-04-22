import { ChevronRightIcon } from "lucide-react";
import { FolderIcon, FileIcon } from "@react-symbols/icons/utils"
import { Id, Doc } from '../../../convex/_generated/dataModel'
import { useCreateFile, useCreateFolder, useDeleteFile, useFolderContent, useRenameFile } from "../../features/projects/hooks/use-file"
import { getItemPadding } from "./constant"
import { useState } from "react";
import { TreeItemWrapper } from "./tree-item-wrapper";

export const Tree = ({ file, level, projectId }:
  {

    file: Doc<"files">;
    level: number;
    projectId: Id<"projects">;

  }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const createFile = useCreateFile();
  const createFolder = useCreateFolder();
  const deleteFile = useDeleteFile();
  const renameFile = useRenameFile();

  const folderContent = useFolderContent({
    projectId,
    parentId: file._id,
    enabled: file.type === "folder" && isOpen,
  })
  if (file.type === "folder") {
    return (
      <TreeItemWrapper
        item={file}
        level={level}
        isActive={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onRename={() => setIsRenaming(true)}
        onCreateFile={() => setCreating("file")}
        onCreateFolder={() => setCreating("folder")}
        onDelete={() => {
            setDeleting(true)
            deleteFile({fileId : file._id})         
        }}
      >
        <ChevronRightIcon
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
        <FolderIcon className="w-4 h-4" folderName={file.name} />
        <span>{file.name}</span>

        {/*{folderContent.data?.map((item) => (
          <Tree key={item._id} file={item} level={level + 1} projectId={projectId} />
        ))}*/}
      </TreeItemWrapper>
    )
  }
  if (file.type === "file") {
    return (
      <div>
        I am file

      </div>
    )
  }
  return null;
}