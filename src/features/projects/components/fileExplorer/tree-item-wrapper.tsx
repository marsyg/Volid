import { cn } from '@/lib/utils';
import { Doc } from '../../../../../convex/_generated/dataModel';
import { Button } from '../../../../components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '../../../../components/ui/context-menu';
import { getItemPadding } from './constant';

export const TreeItemWrapper = ({
  item,
  children,
  level,
  isActive,
  onClick,
  onDoubleClick,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
}: {
  item: Doc<'files'>;
  children: React.ReactNode;
  level: number;
  isActive: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onCreateFile?: () => void;
  onCreateFolder?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onRename?.();
            }
            if (e.key === 'f') {
              e.preventDefault();
              onCreateFile?.();
            }
            if (e.key === 'd') {
              e.preventDefault();
              onCreateFolder?.();
            }
          }}
          style={{ paddingLeft: getItemPadding(level, item.type === 'file') }}
          className={cn(
            'group flex items-center gap-1 w-full h-5.5 hover:bg-accent/30 outline-none focus:ring-innset focus:ring-ring',
            isActive && 'bg-accent/30'
          )}
        >
          {children}
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent onCloseAutoFocus={(e) => e.preventDefault()} className="w-64">
        {item.type === 'folder' && (
          <>
            <ContextMenuItem className="text-sm" onClick={onCreateFile}>
              New File
            </ContextMenuItem>
            <ContextMenuItem className="text-sm" onClick={onCreateFolder}>
              New Folder
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem className="text-sm" onClick={onRename}>
          Rename ..
          <ContextMenuShortcut>
            <Button size="sm" className="text-sm">
              Enter
            </Button>
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem className="text-sm" onClick={onDelete}>
          Delete
          <ContextMenuShortcut>
            <Button variant="ghost" size="sm" className="text-sm">
              Delete
            </Button>
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
