import { Button } from '@/components/ui/button';
import { Id } from '../../../../convex/_generated/dataModel';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import { useProject, useRenameProject } from '../hooks/use-projects';

import { UserButton } from '@clerk/nextjs';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CloudIcon, LoaderIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const Navbar = ({ projectId }: { projectId: Id<'projects'> }) => {
  const project = useProject(projectId);
  const renameProject = useRenameProject(projectId);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(project?.name);

  const handleRename = () => {
    if (project) {
      setIsRenaming(true);
      setNewName(project.name);
    }
  };
  const handleSubmit = () => {
    if (!newName) throw new Error('Name cannot be empty');
    renameProject({ id: projectId, name: newName });
    setIsRenaming(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setIsRenaming(false);
    }
  };
  return (
    <div className="flex items-center justify-between gap-x-2 bg-sidebar h-10 p-2 border-b">
      <div className="flex items-center gap-1.5">
        <Breadcrumb>
          <BreadcrumbList className="gap-0!">
            <BreadcrumbItem>
              <BreadcrumbLink
                className="flex items-center gap-1.5 group/logo"
                asChild
                href={`/projects/${projectId}`}
              >
                <Button variant="ghost" className="w-fit! p-1.5! h-7!" asChild>
                  <Link href={`/`}>
                    <Image src="/vercel.svg" alt="" width={20} height={20} />
                    <span
                      className={cn(
                        'hidden group-hover/logo:block',
                        font.className,
                      )}
                    >
                      Volid
                    </span>
                  </Link>
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="ml-0! mr-1!" />
            {isRenaming ? (
              <BreadcrumbItem>
                <input
                  autoFocus
                  onFocus={() => {}}
                  onKeyDown={(e) => {
                    handleKeyDown(e);
                  }}
                  onBlur={() => setIsRenaming(false)}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-sm bg-transparent text-foreground outline-none w-40 focus:ring focus:ring-primary"
                />
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage
                  onClick={() => handleRename()}
                  className="text-sm cursor-pointer hover:text-primary font-medium max-w-40 turncate"
                >
                  {project?.name ?? 'Loading...'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        {project?.importStatus ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <LoaderIcon className="size-4  text-muted-foreground animate-accordion-down" />
              
            </TooltipTrigger>
            <TooltipContent>Importing...</TooltipContent>
          </Tooltip>
        ) : (
          project?.updatedAt && (
            <Tooltip>
              <TooltipTrigger asChild>
                <CloudIcon className="size-4  text-muted-foreground " />
                
                              </TooltipTrigger>
                              <TooltipContent>
                                Saved{' '}
                                {formatDistanceToNow(project.updatedAt, { addSuffix: false })}
                              </TooltipContent>
            </Tooltip>
          )
        )}
      </div>
      <div className="">
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
