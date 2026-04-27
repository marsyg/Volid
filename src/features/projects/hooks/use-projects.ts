import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export const useProject = (id: Id<'projects'>) => {
  return useQuery(api.projects.getById, {
    id,
  });
};
export const useProjects = () => {
  return useQuery(api.projects.get);
};
export const useProjectpartial = (limit: number) => {
  return useQuery(api.projects.getPartial, {
    limit,
  });
};
export const useCreateProjects = () => {
  return useMutation(api.projects.create).withOptimisticUpdate(
    (localStorage, args) => {
      const existingProject = localStorage.getQuery(api.projects.get);
      if (existingProject !== undefined) {
        const newProject = {
          _id: crypto.randomUUID() as Id<'projects'>,
          _creationTime: Date.now(),
          name: args.name,
          ownerId: 'anonymous',
          updatedAt: Date.now(),
        };

        localStorage.setQuery(api.projects.get, {}, [
          newProject,
          ...existingProject,
        ]);
      }
    },
  );
};

export const useRenameProject = (projectId: Id<'projects'>) => {
  return useMutation(api.projects.rename).withOptimisticUpdate(
    (localStorage, args) => {
      const existingProject = localStorage.getQuery(api.projects.getById, {
        id: projectId,
      });
      if (existingProject !== undefined && existingProject !== null) {
        const updatedProject = {
          ...existingProject,
          name: args.name,
          updatedAt: Date.now(),
        };
        localStorage.setQuery(
          api.projects.getById,
          { id: projectId },
          updatedProject,
        );
      }

      const projectsList = localStorage.getQuery(api.projects.get);
      if (projectsList !== undefined && projectsList !== null) {
        const updatedList = projectsList.map((p: any) =>
          p._id === projectId
            ? { ...p, name: args.name, updatedAt: Date.now() }
            : p,
        );
        localStorage.setQuery(api.projects.get, {}, updatedList);
      }
    },
  );
};
