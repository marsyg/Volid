import { PinIcon, XIcon } from 'lucide-react';
import { ta } from 'zod/v4/locales';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useFile, useFiles } from '@/features/projects/hooks/use-file';
import { buildPath, cn } from '@/lib/utils';
import { Doc, type Id } from '../../../../convex/_generated/dataModel';
import { useEditorStore } from '../store/useEditorStore';

//double click pe pinned true karna hai
// store tabs lene hai add use map karna hai
// individual tab ka structure based on the
interface TabItemProps {
  onClick: () => void;
  onDoubleClick: () => void;
  activeId: Id<'files'> | null;
  pinned: boolean;
  tabId: Id<'files'>;
  projectId: Id<'projects'>;
}
const TabItem = ({
  onClick,
  onDoubleClick,
  activeId,
  pinned,
  tabId,
  projectId,
}: TabItemProps & { projectId: Id<'projects'> }) => {
  const { closeTab, setActiveTab } = useEditorStore();
  const file = useFile(tabId, projectId);
  const tabName = file?.name;
  const isActive = activeId === tabId;
  const handleClose = (projectId: Id<'projects'>, tabId: Id<'files'>) => {
    closeTab(projectId, tabId);
  };
  return (
    <div
      onClick={() => {
        setActiveTab(projectId, tabId);
      }}
      className={cn('flex group items-center ', { 'bg-muted': isActive })}
    >
      <div className="flex items-center mx-1">
        <span>{tabName}</span>
        <XIcon
          onClick={() => handleClose(projectId, tabId)}
          className="size-2.5 m-1 opacity-0 group-hover:opacity-100 transition hover:bg-gray-600 hover:scale-150 "
        />
        {pinned && <PinIcon className="size-2" />}
      </div>
    </div>
  );
};
export const TabBar = ({
  activeTab,
  setActiveTab,
  projectId,
}: {
  activeTab: 'code' | 'preview';
  setActiveTab: (tab: 'code' | 'preview') => void;
  projectId: Id<'projects'>;
}) => {
  const { tabs } = useEditorStore();
  for (const [key, value] of tabs.entries()) {
    console.log(key, value);
  }

  const tabBars = tabs.get(projectId)?.openTabs;
  const activeTabId = tabs.get(projectId)?.activeTabId;
  const files = useFiles(projectId);
  const fileMap = new Map(files?.map((file) => [file._id, file]));
  let path;
  if (activeTabId) {
    path = buildPath(activeTabId, fileMap);
  }

  console.log(tabBars, 'this is id open files');
  console.log(activeTabId, 'this is active tab id');
  return (
    <div className="flex  flex-col">
      <div className="flex flex-row  ">
        {tabBars?.map((tab, index) => (
          <TabItem
            key={index}
            onClick={() => {}}
            onDoubleClick={() => {}}
            activeId={activeTabId}
            pinned={false}
            tabId={tab}
            projectId={projectId}
          />
        ))}
      </div>

      {path && (
        <div className="flex  bg-muted border-b items-center gap-2">
          <Breadcrumb className="m-1">
            <BreadcrumbList>
              {path.map((name, index) => (
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink href="#">{name}</BreadcrumbLink>
                  {index < path.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}
    </div>
  );
};
