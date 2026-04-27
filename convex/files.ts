import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { verifyAuth } from './auth';
import { Id } from './_generated/dataModel';

export const getFiles = query({
  args: {
    projectId: v.id('projects'),
    parentId: v.optional(v.id('files')),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const project = await ctx.db.get('projects', args.projectId);
    if (!project) throw new Error('Project not found');
    if (!identity) throw new Error('Unauthorized');
    if (project.ownerId !== identity.subject) throw new Error('Unauthorized');
    const files = await ctx.db
      .query('files')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    return files;
  },
});

export const getFile = query({
  args: {
    fileId: v.id('files'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    if (!identity) throw new Error('Unauthorized');

    // Verify the project exists and belongs to the authenticated user
    const project = await ctx.db.get('projects', args.projectId);
    if (!project) throw new Error('Project not found');
    if (project.ownerId !== identity.subject) throw new Error('Unauthorized');

    // Fetch the file and verify it belongs to the project
    const file = await ctx.db.get('files', args.fileId);
    if (!file) throw new Error('File not found');
    if (file.projectId !== args.projectId) throw new Error('Unauthorized');

    return file;
  },
});

export const createFiles = mutation({
  args: {
    name: v.string(),
    projectId: v.id('projects'),
    parentId: v.optional(v.id('files')),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    if (!identity) throw new Error('Unauthorized');

    const files = await ctx.db
      .query('files')
      .withIndex('by_project_parent', (q) =>
        q.eq('projectId', args.projectId).eq('parentId', args.parentId),
      )
      .collect();

    const existingFile = files.find(
      (f) => f.name === args.name && f.parentId === args.parentId,
    );
    if (existingFile) throw new Error('File already exists');

    const projectID = await ctx.db.insert('files', {
      name: args.name,
      projectId: args.projectId,
      parentId: args.parentId,
      content: args.content,
      type: 'file',
      updatedAt: Date.now(),
    });
    await ctx.db.patch('projects', args.projectId, { updatedAt: Date.now() });
    return projectID;
  },
});

export const renameFile = mutation({
  args: {
    name: v.string(),
    projectId: v.id('projects'),
    type: v.string(),
    parentId: v.optional(v.id('files')),
    fileId: v.id('files'),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    if (!identity) throw new Error('Unauthorized');

    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error('file not found');
    const project = await ctx.db.get(args.projectId);

    if (!project) throw new Error('project not found');

    // if (file.projectId !== identity.subject) throw new Error('Unauthorized');

    const files = await ctx.db
      .query('files')
      .withIndex('by_project_parent', (q) =>
        q.eq('projectId', args.projectId).eq('parentId', args.parentId),
      )
      .collect();
    const existingFile = files.find(
      (f) =>
        f.name === args.name &&
        f.parentId === args.parentId &&
        f.type === args.type,
    );
    if (existingFile) throw new Error('File already exists');
    if (file.name === args.name && file.parentId === args.parentId) return file;
    await ctx.db.patch(args.fileId, {
      name: args.name,
      updatedAt: Date.now(),
    });
    await ctx.db.patch('projects', file.projectId, { updatedAt: Date.now() });
    return await ctx.db.get(args.fileId);
  },
});

export const getFolderContents = query({
  args: {
    projectId: v.id('projects'),
    parentId: v.optional(v.id('files')),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const project = await ctx.db.get('projects', args.projectId);

    if (!project) throw new Error('Project not found');
    if (!identity) throw new Error('Unauthorized');

    if (project.ownerId !== identity.subject) throw new Error('Unauthorized');

    const files = await ctx.db
      .query('files')
      .withIndex('by_project_parent', (q) =>
        q.eq('projectId', args.projectId).eq('parentId', args.parentId),
      )
      .collect();
    return files.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;

      return a.name.localeCompare(b.name);
    });
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id('files'),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    if (!identity) throw new Error('Unauthorized');

    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error('File not found');

    const project = await ctx.db.get('projects', file.projectId);
    if (!project) throw new Error('Project not found');
    if (project.ownerId !== identity.subject) throw new Error('Unauthorized');

    const files = await ctx.db
      .query('files')
      .withIndex('by_project_parent', (q) =>
        q.eq('projectId', file.projectId).eq('parentId', file.parentId),
      )
      .collect();

    const deleteRec = async (fileId: Id<'files'>) => {
      const file = await ctx.db.get(fileId);
      if (!file) return;
      if (file.type === 'folder') {
        const children = await ctx.db
          .query('files')
          .withIndex('by_project_parent', (q) =>
            q.eq('projectId', file.projectId).eq('parentId', fileId),
          )
          .collect();
        for (const child of children) {
          await deleteRec(child._id);
        }
      }
      await ctx.db.delete(fileId);
    };

    await deleteRec(args.fileId);
    await ctx.db.patch('projects', file.projectId, { updatedAt: Date.now() });
    return files;
  },
});

export const updateFile = mutation({
  args: {
    fileId: v.id('files'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    if (!identity) throw new Error('Unauthorized');

    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error('File not found');

    const project = await ctx.db.get('projects', file.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== identity.subject) throw new Error('Unauthorized');
    await ctx.db.patch(args.fileId, {
      content: args.content,
      updatedAt: Date.now(),
    });

    // const files = await ctx.db.query("files")
    //     .withIndex("by_project_parent", (q) => q.eq("projectId", args.projectId).eq("parentId", args.parentId))
    //     .collect();
    // const existingFile = files.find((f) => f.name === args.name && f.type === args.type);
    // if (existingFile) throw new Error('File already exists');

    return file;
  },
});
export const createFile = mutation({
  args: {
    parentId: v.optional(v.id('files')),
    projectId: v.id('projects'),
    name: v.string(),
    type: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    if (!identity) throw new Error('Unauthorized');

    const project = await ctx.db.get('projects', args.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== identity.subject) throw new Error('Unauthorized');

    const files = await ctx.db
      .query('files')
      .withIndex('by_project_parent', (q) =>
        q.eq('projectId', args.projectId).eq('parentId', args.parentId),
      )
      .collect();
    const existingFile = files.find(
      (f) => f.name === args.name && f.type === args.type,
    );
    if (existingFile) throw new Error('File already exists');

    const file = await ctx.db.insert('files', {
      parentId: args.parentId,
      projectId: args.projectId,
      name: args.name,
      type: 'file',
      content: args.content,
      updatedAt: Date.now(),
    });

    return file;
  },
});

export const createFolder = mutation({
  args: {
    parentId: v.optional(v.id('files')),
    projectId: v.id('projects'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    if (!identity) throw new Error('Unauthorized');

    const project = await ctx.db.get('projects', args.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== identity.subject) throw new Error('Unauthorized');

    const files = await ctx.db
      .query('files')
      .withIndex('by_project_parent', (q) =>
        q.eq('projectId', args.projectId).eq('parentId', args.parentId),
      )
      .collect();
    const existingFile = files.find(
      (f) => f.name === args.name && f.type === 'folder',
    );
    if (existingFile) throw new Error('Folder already exists');

    const folder = await ctx.db.insert('files', {
      parentId: args.parentId,
      projectId: args.projectId,
      name: args.name,
      type: 'folder',
      updatedAt: Date.now(),
    });

    return folder;
  },
});
