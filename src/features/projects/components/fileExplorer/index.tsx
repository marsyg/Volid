import {
  ChevronRightIcon,
  CopyMinusIcon,
  FileIcon,
  FolderPlus,
  FolderPlusIcon,
} from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useProject } from '@/features/projects/hooks/use-projects';
import { Button } from '../../../../components/ui/button';
import {
  useCreateFile,
  useCreateFolder,
  useFolderContent,
} from '@/features/projects/hooks/use-file';
import { CreateInput } from './create-input';
import { LoadingRow } from './loading-row';
import { Tree } from './tree';

export const FileExplorer = ({ projectId }: { projectId: Id<'projects'> }) => {
  const [openFiles, setOpenFiles] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [collapse, setCollapse] = useState(0);
  const [creating, setCreating] = useState<'file' | 'folder' | null>(null);

  const project = useProject(projectId);
  const createFile = useCreateFile();
  const createFolder = useCreateFolder();
  const rootFiles = useFolderContent({ projectId, enabled: isOpen });
  const handleCreate = (name: string) => {
    if (creating === 'file') {
      createFile({
        projectId,
        name,
        type: 'file',
        content: '',
        parentId: undefined,
      });
    } else {
      createFolder({
        name,
        projectId,
        parentId: undefined,
      });
    }
    setCreating(null);
  };
  return (
    <div className="h-full w-full bg-sidebar">
      <ScrollArea>
        <div
          role="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group/project curosor-pointer w-full bg-accent text-left flex items-center gap-0.5"
        >
                  <ChevronRightIcon
                      
            className={cn(
              'size-4 shrink- text-muted-foreground group-hover:translate-x-1',
              isOpen ? 'rotate-90' : 'rotate-0',
            )}
          />
          <span className="text-xs uppercase line-clamp-1">
            {project?.name}
                  </span>                  
          <div className="group/hover  project:opacity-100 transition-none duration-0  flex items-center gap-0.5 ml-auto ">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
                setCreating('file');
              }}
              variant="highlight"
              size="icon-xs"
              className=""
            >
              <FileIcon className="size-3.5" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
                setCreating('folder');
                //set creating folder to true
              }}
              variant="highlight"
              size="icon-xs"
              className=""
            >
              <FolderPlusIcon className="size-3.5" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                //reset collapse
                setCollapse((prev) => prev + 1);
                setIsOpen(false);
                setCreating(null);
              }}
              variant="highlight"
              size="icon-xs"
              className=""
            >
              <CopyMinusIcon className="size-3.5" />
            </Button>
          </div>
        </div>
        {isOpen && (
          <>
            {rootFiles === undefined && <LoadingRow level={0} />}
           {creating && <CreateInput type={creating} level={0} onSubmit={handleCreate} onCancel={() => setCreating(null)} />}

            {rootFiles?.map((file) => (
              <Tree
                key={`${file._id}-${collapse}`}
                file={file}
                level={0}
                projectId={projectId}
              ></Tree>
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  );
};
