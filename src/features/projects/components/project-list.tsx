import { Spinner } from '@/components/ui/spinner';
import { useProjectpartial } from '../hooks/use-projects';
import { Doc } from '../../../../convex/_generated/dataModel';
import {
  AlertCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  FolderIcon,
  GlobeIcon,
  Loader2Icon,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { Kbd } from '@/components/ui/kbd';
import { formatDistanceToNow } from 'date-fns';

const getProjectIcon = (project: Doc<'projects'>) => {
  if (project.importStatus === 'completed') {
    return <FaGithub className="size-4 text-foreground/80" />;
  }
  if (project.importStatus === 'failed') {
    return <AlertCircleIcon className="size-4 text-destructive" />;
  }
  if (project.importStatus === 'imported') {
    return <Loader2Icon className="size-4 text-muted-foreground animate-spin" />;
  }
  return <FolderIcon className="size-4 text-primary/80" />;
};

interface ProjectListProps {
  onViewAll: () => void;
}

const formatTimeStamp = (timeStamp: number) => {
  return formatDistanceToNow(new Date(timeStamp), {
    addSuffix: true,
  });
};

const ProjectItem = ({ data }: { data: Doc<'projects'> }) => {
  return (
    <li>
      <Link
        href={`/projects/${data._id}`}
        className="group flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-border/40 hover:border-border hover:bg-secondary/40 transition-all duration-150"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-1.5 rounded-md bg-secondary/80 text-muted-foreground group-hover:text-foreground transition-colors">
            {getProjectIcon(data)}
          </div>
          <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground truncate transition-colors">
            {data.name}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
            {formatTimeStamp(data.updatedAt)}
          </span>
          <ArrowRightIcon className="size-3.5 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </div>
      </Link>
    </li>
  );
};

const ContinueCard = ({ data }: { data: Doc<'projects'> }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <ClockIcon className="size-3" /> Continue working
        </span>
      </div>

      <Link
        href={`/projects/${data._id}`}
        className="group relative flex flex-col gap-3 p-4 rounded-xl bg-card border border-border/70 hover:border-primary/50 hover:bg-accent/15 hover:shadow-sm transition-all duration-200"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {getProjectIcon(data)}
            </div>
            <div>
              <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {data.name}
              </span>
              <p className="text-xs text-muted-foreground">
                Active project workspace
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors">
              {formatTimeStamp(data.updatedAt)}
            </span>
            <div className="size-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all">
              <ArrowRightIcon className="size-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const ProjectList = ({ onViewAll }: ProjectListProps) => {
  const projects = useProjectpartial(6);

  if (projects === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-5 text-primary" />
      </div>
    );
  }

  const [mostRecent, ...rest] = projects;

  return (
    <div className="flex flex-col gap-5">
      {mostRecent && <ContinueCard data={mostRecent} />}

      {rest.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent Projects
            </span>
            <button
              type="button"
              onClick={onViewAll}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
            >
              <span>View all</span>
              <Kbd className="text-[10px] px-1 py-0 bg-secondary border">⌘K</Kbd>
            </button>
          </div>
          <ul className="flex flex-col gap-1.5">
            {rest.map((project) => (
              <ProjectItem key={project._id} data={project} />
            ))}
          </ul>
        </div>
      ) : !mostRecent ? (
        <div className="p-6 rounded-xl border border-dashed border-border/80 text-center text-xs text-muted-foreground">
          No projects yet. Press <Kbd className="mx-1">J</Kbd> or click New Project to get started.
        </div>
      ) : null}
    </div>
  );
};
