import { WebContainer } from "@webcontainer/api";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import type { FileSystemTree } from "@webcontainer/api";

export function buildTree(
  files: Doc<'files'>[]
): FileSystemTree {
  const getChildren = (parentId?: Id<'files'>): FileSystemTree => {
    const branch: FileSystemTree = {};
    files.filter((file) => file.parentId === parentId).forEach((file) => {
      if (file.type === "file") {
        branch[file.name] = {
          file: {
            contents: file.content || "",
          },
        }
      } else {
        branch[file.name] = {
          directory: getChildren(file._id)
        }
      }
    })
    return branch;
  }
  return getChildren(undefined);


}

export function getFilePath(files: Doc<'files'>[], fileId: Id<'files'>) {
  const parts: string[] = [];
  let current = files.find((f) => f._id == fileId);

  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? files.find((f) => f._id == current?.parentId) : undefined

  }
  return parts.join('/')
}