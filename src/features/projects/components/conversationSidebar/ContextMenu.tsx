import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LucideIcon } from 'lucide-react';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useFile, useFiles, useFolderContent } from '../../hooks/use-file';
import CustomButton from './Button';

type ContextValue =
  | { type: 'codebase' }
  | { type: 'currentFile' }
  | { type: 'selection' }
  | { type: 'file'; fileId: Id<'files'> }
  | { type: 'folder' }
  | { type: 'folderContent'; folderId: Id<'files'> };

type ContextItemOption = {
  type: 'item';
  label: string;
  value: ContextValue;
};
type ContextSubMenuOption = {
  type: 'submenu';
  label: string;
  children: ContextItemOption[];
};
type ContextMenuOption = ContextItemOption | ContextSubMenuOption;
type baseProps = {
  projectId: Id<'projects'>;
  fileId?: Id<'files'>;
  onChange: (value: string) => void;
};
type Option = {
  value: string;
  label: string;
};
type ContextMenuProps = {
  value: string;
  onChange: (value: string) => void;
 
  placeholder: string;
  className?: string;
  icons?: LucideIcon;
};
type props = baseProps & ContextMenuProps;

export const ContextMenu = ({
  projectId,
  fileId,
  onChange,
  value,
  placeholder,
  className,
  icons,
}: props) => {
  const files = useFiles(projectId);
  const file = useFile(fileId, projectId);
  const folder = useFolderContent({ projectId });
  const contextOptions: ContextMenuOption[] = [
    {
      type: 'item',
      label: 'Codebase',
      value: { type: 'codebase' },
    },
    {
      type: 'item',
      label: 'Current File',
      value: { type: 'currentFile' },
    },
    {
      type: 'item',
      label: 'Selection',
      value: { type: 'selection' },
    },
    ...(files?.length
      ? [
          {
            type: 'submenu' as const,
            label: 'Files',
            children: files.map((file) => ({
              type: 'item' as const,
              label: file.name,
              value: { type: 'file' as const, fileId: file._id },
            })),
          },
        ]
      : []),
    ...(folder?.length
      ? [
          {
            type: 'submenu' as const,
            label: 'Folders',
            children: folder.map((item) => ({
              type: 'item' as const,
              label: item.name,
              value: { type: 'folder' as const, folderId: item._id },
            })),
          },
        ]
      : []),
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <CustomButton name={value || placeholder} Icon={icons} />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {contextOptions.map((contextOption) => {
          if (contextOption && contextOption.type === 'submenu') {
            return (
              <DropdownMenuSub key={contextOption.label}>
                <DropdownMenuSubTrigger>{contextOption.label}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {contextOption.children.map((child) => (
                    <DropdownMenuItem key={child.label} onSelect={() => onChange(child.value.type)}>
                      {child.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          }

          return (
            <DropdownMenuItem
              key={contextOption.label}
              onSelect={() => onChange(contextOption.value.type)}
            >
              {contextOption.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
