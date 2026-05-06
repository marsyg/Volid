import { ProjectIdView } from '@/features/projects/components/project-id-view';
import type { Id } from '../../../../convex/_generated/dataModel';

const ProjectIdPage = async ({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const { projectId } = await params;

  return (
    <div>
      <ProjectIdView projectId={projectId as Id<'projects'>}>
      </ProjectIdView>
    </div>
  );
};

export default ProjectIdPage;
