import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { mutation, query, type MutationCtx, type QueryCtx } from './_generated/server';
import { verifyAuth } from './auth';

const assertProjectOwner = async (
  ctx: QueryCtx | MutationCtx,
  projectId: Id<'projects'>,
  userId: string,
) => {
  const project = await ctx.db.get(projectId);
  if (!project) throw new Error('Project not found');
  if (project.ownerId !== userId) throw new Error('Unauthorized');
};

export const createAgentRun = mutation({
  args: {
    userId: v.string(),
    projectId: v.id('projects'),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);

    return await ctx.db.insert('agentRuns', {
      userId: args.userId,
      projectId: args.projectId,
      runId: crypto.randomUUID(),
      status: 'pending',
      prompt: args.prompt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});


export const markAgentRunAsComplete = mutation({  
  args: {
    runId: v.id('agentRuns'),
    result: v.string(),
    projectId: v.id('projects'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);
    const { runId, result } = args;
    await ctx.db.patch( runId, {
      status: "completed",
      result,
      updatedAt: Date.now(),
    }); 
  },    
});

export const markAgentRunAsFailed = mutation({
  args: {
    runId: v.id('agentRuns'),               
    error: v.string(),
    projectId: v.id('projects'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);
    const { runId, error } = args;
    await ctx.db.patch(runId, {
      status: 'failed',
      error,
      updatedAt: Date.now(),
      });     
  },
});
export const markAgentAsRunning = mutation({
  args: {
    runId: v.id('agentRuns'),
    projectId: v.id('projects'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);

    await ctx.db.patch(args.runId, {
      status: 'running',
      updatedAt: Date.now(),
    });
  },
});

export const getRunAgent = query({
  args: {
    runId: v.id('agentRuns'),
    projectId: v.id('projects'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);
    const { runId } = args;
    
    return await ctx.db.get('agentRuns', runId);
  },
});
export const getRunAgentById = query({
  args: {
    runId: v.id('agentRuns'),
    projectId: v.id('projects'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);
    const { runId } = args;
    return await ctx.db.get('agentRuns', runId);  
  },
});

export const getRunForCurrentUser = query({
  args: {
    runId: v.id('agentRuns'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    await assertProjectOwner(ctx, args.projectId, identity.subject);

    const run = await ctx.db.get(args.runId);
    if (!run) return null;
    if (run.projectId !== args.projectId || run.userId !== identity.subject) {
      throw new Error('Unauthorized');
    }

    return run;
  },
});

export const getRecentAgentRuns = query({
  args: {
    projectId: v.id('projects'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await assertProjectOwner(ctx, args.projectId, args.userId);
    return await ctx.db.query('agentRuns')
      .withIndex('by_project_created', q=> q.eq('projectId', args.projectId ))
      .order("desc")
      .take(20)
      
  },
});

export const getRecentAgentRunsForCurrentUser = query({
  args: {
    projectId: v.id('projects'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    await assertProjectOwner(ctx, args.projectId, identity.subject);

    return await ctx.db
      .query('agentRuns')
      .withIndex('by_project_user_created', (q) =>
        q.eq('projectId', args.projectId).eq('userId', identity.subject),
      )
      .order('desc')
      .take(args.limit ?? 20);
  },
});
