import { WebContainer } from "@webcontainer/api";
import { api } from "../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { Id } from "../../convex/_generated/dataModel";
import type { FileSystemTree } from "@webcontainer/api";

export async function buildTree(
  client: ConvexHttpClient,
  projectId: Id<'projects'>,
  parentId?: Id<'files'>
): Promise<FileSystemTree> {

  const folderContents = await client.query(api.files.getFolderContents, {
    projectId,
    parentId
  })

  const tree: FileSystemTree = {};

  for (const file of folderContents) {

    if (file.type === "folder") {
      tree[file.name] = {

        directory: await buildTree(client, projectId, file._id)
      }
    } else {
      tree[file.name] = {
        file: {
          contents: file.content || "",
        },
      }
    }


  }

  return tree;
}