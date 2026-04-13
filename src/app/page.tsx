'use client';
import { Button } from '@/components/ui/button';

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ProjectView } from '@/features/projects/components/Project-view';

const Home = () => {
  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);
  return (
    <div>
      <ProjectView></ProjectView>
    </div>
  );
};

export default Home;
