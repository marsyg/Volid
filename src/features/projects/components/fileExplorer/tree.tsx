import { FileIcon, FolderIcon } from '@react-symbols/icons/utils';
import { ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { useEditorStore } from '@/features/editor/store/useEditorStore';
import { cn } from '@/lib/utils';
import { Doc, Id } from '../../../../../convex/_generated/dataModel';
import {
  useCreateFile,
  useCreateFolder,
  useDeleteFile,
  useFolderContent,
  useRenameFile,
} from '../../hooks/use-file';
import { getItemPadding } from './constant';
import { CreateInput } from './create-input';
import { LoadingRow } from './loading-row';
import { RenameInput } from './rename-input';
import { TreeItemWrapper } from './tree-item-wrapper';

export const Tree = ({
  file,
  level,
  projectId,
}: {
  file: Doc<'files'>;
  level: number;
  projectId: Id<'projects'>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [creating, setCreating] = useState<'file' | 'folder' | null>(null);
  const [deleting, setDeleting] = useState(false);

  const createFile = useCreateFile();
  const createFolder = useCreateFolder();
  const deleteFile = useDeleteFile();
  const renameFile = useRenameFile();

  const openFile = useEditorStore((state) => state.openFile);
  const handleClick = (projectId: Id<'projects'>, fileId: Id<'files'>, pinned: boolean) => {
    openFile(projectId, fileId, { pinned });
  };
  const handleCreate = (name: string) => {
    setCreating(null);

    if (creating === 'file') {
      createFile({
        type: 'file',
        projectId,
        name,
        content: '',
        parentId: file._id,
      });
    } else {
      createFolder({
        projectId,
        name,
        parentId: file._id,
      });
    }
  };

  const handleRename = (newName: string) => {
    setIsRenaming(false);

    if (newName === file.name) {
      return;
    }

    renameFile({
      fileId: file._id,
      name: newName,
      type: file.type,
      projectId: projectId,
    });
  };

  const folderContents = useFolderContent({
    projectId,
    parentId: file._id,
    enabled: file.type === 'folder',
  });
  const folderRender = (
    <>
      <div className="flex items-center gap-0.5 ">
        <ChevronRightIcon className={cn('size-4 shrink-0 ', isOpen && 'rotate-90')} />
        <FolderIcon className="w-4 h-4" folderName={file.name} />

        <span className="truncate">{file.name}</span>
      </div>
    </>
  );

  const folderChildren = isOpen && (
    <>
      {folderContents === undefined && <LoadingRow level={level + 1}></LoadingRow>}
      {creating && (
        <CreateInput
          level={level + 1}
          type={creating}
          onSubmit={handleCreate}
          onCancel={() => setCreating(null)}
        />
      )}
      {folderContents?.map((subItem) => (
        <Tree key={subItem._id} file={subItem} level={level + 1} projectId={projectId} />
      ))}
    </>
  );
  if (file.type === 'folder') {
    if (creating) {
      return (
        <>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="group flex item-center gap-1 h-5.5 hover:bg-accent/30 w-full"
            style={{ paddingLeft: getItemPadding(level, isOpen) }}
          >
            {folderRender}
          </button>
          {folderChildren}
        </>
      );
    }

    if (isRenaming) {
      return (
        <>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="group flex item-center gap-1 h-5.5 hover:bg-accent/30 w-full"
            style={{ paddingLeft: getItemPadding(level, isOpen) }}
          >
            {folderRender}
          </button>
          <RenameInput
            isActive={isRenaming}
            defaultValue={file.name}
            type="folder"
            level={level + 1}
            onSubmit={handleRename}
            onCancel={() => setIsRenaming(false)}
          />
        </>
      );
    }
    return (
      <>
        <TreeItemWrapper
          item={file}
          level={level}
          isActive={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          onRename={() => setIsRenaming(true)}
          onCreateFile={() => setCreating('file')}
          onCreateFolder={() => setCreating('folder')}
          onDelete={() => {
            setDeleting(true);
            deleteFile({ fileId: file._id });
          }}
        >
          {folderRender}
        </TreeItemWrapper>
        {folderChildren}
      </>
    );
  }
  if (file.type === 'file') {
    if (isRenaming) {
      return (
        <RenameInput
          isActive={isRenaming}
          type="file"
          defaultValue={file.name}
          level={level}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
      );
    }
    return (
      <TreeItemWrapper
        item={file}
        level={level}
        isActive={isOpen}
        onClick={() => handleClick(projectId, file._id, false)}
        onCreateFile={() => {}}
        onDelete={() => {
          setDeleting(true);
          deleteFile({ fileId: file._id });
        }}
        onRename={() => setIsRenaming(true)}
      >
        <FileIcon fileName={file.name} className="w-4 h-4" />
        <span className="truncate text-sm">{file.name}</span>
      </TreeItemWrapper>
    );
  }
  return null;
};
