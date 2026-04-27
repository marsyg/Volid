import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

import { useMutation, useQuery } from "convex/react";

export const useFile = (
  fileId?: Id<"files">,
  projectId?: Id<"projects">
) => {
  return useQuery(
    api.files.getFile,
    fileId && projectId ? { fileId, projectId } : "skip"
  );
};


export const useFiles = (projectId: Id<"projects">) => {
   return useQuery(api.files.getFiles, { projectId });
};

export const useCreateFile = () => {
   return useMutation(api.files.createFile);
};

export const useCreateFolder = () => {
   return useMutation(api.files.createFolder);
};

export const useFolderContent = ({
    projectId,
    parentId,
    enabled = true,
}: {
    projectId: Id<"projects">;
    parentId?: Id<"files">;
    enabled?: boolean;
}) => {
   return useQuery(api.files.getFolderContents, enabled ? { parentId, projectId } : "skip");
}

export const useRenameFile = () => {
   return useMutation(api.files.renameFile);
}

export const useDeleteFile = () => {
   return useMutation(api.files.deleteFile);
}

export const useUpdateFile = () => {
   return useMutation(api.files.updateFile);
}