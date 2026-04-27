import { FaGithub } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const Tab = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="">
      <button
        onClick={onClick}
        className={cn(
          'flex px-2 items-center cursor-pointer  text-muted-foreground border-r hover:bg-accent/30',
          isActive ? 'bg-background text-foreground' : '',
        )}
      >
        {label}
      </button>
    </div>
  );
};

const ViewSwitcher = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'code' | 'preview';
  setActiveTab: (tab: 'code' | 'preview') => void;
}) => {
  return (
    <nav className="flex justify-self-auto  items-center border-b">
      <Tab
        label="code"
        isActive={activeTab === 'code'}
        onClick={() => setActiveTab('code')}
      />
      <Tab
        label="preview"
        isActive={activeTab === 'preview'}
        onClick={() => setActiveTab('preview')}
      />
      <div className="flex flex-1 justify-end items-center">
        <div className="flex px-2 items-center cursor-pointer text-muted-foreground border-r hover:bg-accent/30">
          <FaGithub />
          <span className="ml-2 text-sms">Export</span>
        </div>
      </div>
    </nav>
  );
};

export default ViewSwitcher;
