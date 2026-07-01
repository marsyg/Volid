import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

const assertProjectOwner = async (
  ctx: QueryCtx | MutationCtx,
  projectId: Id<"projects">,
  userId: string,
) => {
  const project = await ctx.db.get(projectId);
  if (!project) throw new Error("Project not found");
  if (project.ownerId !== userId) throw new Error("Unauthorized");
};

export const getFolderContents = query({
  args: {
    userId: v.string(),
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);

    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId),
      )
      .collect();

    return files.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });
  },
});

export const getFile = query({
  args: {
    userId: v.string(),
    projectId: v.id("projects"),
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);

    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error("File not found");
    if (file.projectId !== args.projectId) throw new Error("Unauthorized");

    return file;
  },
});

export const updateFile = mutation({
  args: {
    userId: v.string(),
    fileId: v.id("files"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error("File not found");

    await assertProjectOwner(ctx, file.projectId, args.userId);

    await ctx.db.patch(args.fileId, {
      content: args.content,
      updatedAt: Date.now(),
    });

    await ctx.db.patch(file.projectId, {
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.fileId);
  },
});

export const createFile = mutation({
  args: {
    userId: v.string(),
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);

    const existing = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId),
      )
      .collect();

    if (existing.some((file) => file.name === args.name && file.type === "file")) {
      throw new Error("File already exists");
    }

    const fileId = await ctx.db.insert("files", {
      projectId: args.projectId,
      parentId: args.parentId,
      name: args.name,
      type: "file",
      content: args.content,
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.projectId, {
      updatedAt: Date.now(),
    });

    return fileId;
  },
});

export const createFolder = mutation({
  args: {
    userId: v.string(),
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);

    const existing = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId),
      )
      .collect();

    if (existing.some((file) => file.name === args.name && file.type === "folder")) {
      throw new Error("Folder already exists");
    }

    const folderId = await ctx.db.insert("files", {
      projectId: args.projectId,
      parentId: args.parentId,
      name: args.name,
      type: "folder",
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.projectId, {
      updatedAt: Date.now(),
    });

    return folderId;
  },
});
