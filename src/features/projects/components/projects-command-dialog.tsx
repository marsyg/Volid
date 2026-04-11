import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { AlertCircleIcon, GlobeIcon, Loader2Icon } from "lucide-react";

import {
    CommandDialog,
    CommandInput,
    CommandItem,
    CommandList,
    CommandEmpty,
    CommandGroup,
} from "@/components/ui/command";

import { useProjects } from "../hooks/use-projects";
import { Doc } from "../../../../convex/_generated/dataModel";

interface ProjectCommandDailogProps {
    open: boolean
    ,
    onOpenChange: (open: boolean) => void
}
const getProjectIcon = (projects: Doc<"projects">) => {
    if (projects.importStatus === "completed") {
        return <FaGithub />
    }
    if (projects.importStatus === "failed") {
        return <AlertCircleIcon className=' size-4 text-muted-foreground' />
    }
    if (projects.importStatus === "imported") {
        return <Loader2Icon className=' size-4 text-muted-foreground animate-spin' />
    }
    return <GlobeIcon className=' size-4 text-muted-foreground ' />
}


export function ProjectCommandDialog({ open, onOpenChange }: ProjectCommandDailogProps) {
    const router = useRouter();
    const projects = useProjects();
    const handleSelect = (projectId: string) => {
        router.push(`/projects/${projectId}`);
        onOpenChange(false);
    };
    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Search projects..." />
            <CommandList>
                <CommandEmpty>No projects found.</CommandEmpty>
                <CommandGroup>
                    {projects?.map((project) => (
                        <CommandItem key={project._id} value={project.name} onSelect={() => handleSelect(project._id)}>
                            <div className="flex items-center gap-2">
                                {getProjectIcon(project)}
                                <span>{project.name}</span>
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
