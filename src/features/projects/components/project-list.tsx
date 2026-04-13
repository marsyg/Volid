import { Spinner } from '@/components/ui/spinner';
import { useProjectpartial, useProjects } from '../hooks/use-projects';
import { Doc } from '../../../../convex/_generated/dataModel';
import {
  AlertCircleIcon,
  ArrowRightIcon,
  GlobeIcon,
  Loader2Icon,
} from 'lucide-react';
import { format } from 'path';
import { formatDistance, formatDistanceToNow } from 'date-fns';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const getProjectIcon = (projects: Doc<'projects'>) => {
  if (projects.importStatus === 'completed') {
    return <FaGithub />;
  }
  if (projects.importStatus === 'failed') {
    return <AlertCircleIcon className=" size-3.5 text-muted-foreground" />;
  }
  if (projects.importStatus === 'imported') {
    return (
      <Loader2Icon className=" size-3.5 text-muted-foreground animate-spin" />
    );
  }
  return <GlobeIcon className=" size-3.5 text-muted-foreground " />;
};

interface ProjectListProops {
  onViewAll: () => void;
}

const formatTimeStamp = (timeStamp: number) => {
  return formatDistanceToNow(new Date(timeStamp), {
    addSuffix: true,
  });
};
const ProjectItem = ({ data }: { data: Doc<'projects'> }) => {
  return (
    <Link
      href={`/projects/${data._id}`}
      className="text-sm text-foreground/60 font-medium hover:text-foreground py-1 flex items-center justify-between w-full group"
    >
      <div className=" flex items-center gap-2 ">
        {getProjectIcon(data)}
        <span className=""> {data.name}</span>
      </div>
      <ArrowRightIcon className="text-muted-foreground size-4 group-hover:translate-x-0.5 transition-transform"></ArrowRightIcon>
      <span className="text-xs  text-muted-foreground group-hover:text-foreground/60 transition-colors">
        {formatTimeStamp(data.updatedAt)}
      </span>
    </Link>
  );
};

const ContinueCard = ({ data }: { data: Doc<'projects'> }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">Last updatedAt</span>
      <Button
        variant="outline"
        asChild
        className="h-auto items-start justify-start p-4 background  border  rounded-none  flex flex-col gap-2"
      >
        <Link href={`/projects/${data._id}`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {getProjectIcon(data)}
              <span className="">{data.name}</span>
            </div>
            <ArrowRightIcon className="text-muted-foreground size-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
            {formatTimeStamp(data.updatedAt)}
          </span>
        </Link>
      </Button>
    </div>
  );
};

export const ProjectList = ({ onViewAll }: ProjectListProops) => {
  const projects = useProjectpartial(6);
  if (projects == undefined) return <Spinner className="size-4 text-ring" />;
  const [mostRecent, ...rest] = projects;

  return (
    <div className="flex flex-col gap-4">
      {mostRecent && <ContinueCard data={mostRecent} />}
      {rest.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-xs ">
              RecentProjects
            </span>
            <button
              onClick={onViewAll}
              className="flex items-center gap-2 text-muted-foreground text-xs  hover:text-foreground transition-colors"
            >
              <span>View All</span>
              <kbd className="bg-accent border"></kbd>
            </button>
          </div>
          <ul>
            {projects.map((project) => (
              <ProjectItem key={project._id} data={project}></ProjectItem>
            ))}
          </ul>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">No projects yet.</span>
      )}
    </div>
  );
};
