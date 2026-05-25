import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { mutation, query, type MutationCtx, type QueryCtx } from './_generated/server';

const assertProjectOwner = async (
  ctx: QueryCtx | MutationCtx,
  projectId: Id<'projects'>,
  userId: string,
) => {
  const project = await ctx.db.get(projectId);
  if (!project) throw new Error('Project not found');
  if (project.ownerId !== userId) throw new Error('Unauthorized');
};

export const addMessage = mutation({
  args: {
    userId: v.string(),
    projectId: v.id('projects'),
    role: v.union(
      v.literal('user'),
      v.literal('assistant'),
      v.literal('tool'),
      v.literal('system'),
    ),
    content: v.string(),
    runId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);

    return await ctx.db.insert('agentMessages', {
      userId: args.userId,
      projectId: args.projectId,
      role: args.role,
      content: args.content,
      runId: args.runId,
      createdAt: Date.now(),
    });
  },
});

export const getRecentMessages = query({
  args: {
    userId: v.string(),
    projectId: v.id('projects'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);

    const messages = await ctx.db
      .query('agentMessages')
      .withIndex('by_project_user_created', (q) =>
        q.eq('projectId', args.projectId).eq('userId', args.userId),
      )
      .order('desc')
      .take(args.limit ?? 20);

    return messages.reverse();
  },
});

export const getProjectMemory = query({
  args: {
    userId: v.string(),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);

    return await ctx.db
      .query('agentMemory')
      .withIndex('by_project_user', (q) =>
        q.eq('projectId', args.projectId).eq('userId', args.userId),
      )
      .unique();
  },
});

export const upsertProjectMemory = mutation({
  args: {
    userId: v.string(),
    projectId: v.id('projects'),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);

    const existing = await ctx.db
      .query('agentMemory')
      .withIndex('by_project_user', (q) =>
        q.eq('projectId', args.projectId).eq('userId', args.userId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        summary: args.summary,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert('agentMemory', {
      userId: args.userId,
      projectId: args.projectId,
      summary: args.summary,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
