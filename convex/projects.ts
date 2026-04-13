import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { verifyAuth } from './auth';
export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    if (!identity) return [];
    const projectID = await ctx.db.insert('projects', {
      name: args.name,
      ownerId: identity?.subject,
      updatedAt: Date.now(),
    });
    return projectID;
  },
});

export const getPartial = query({
  args: {
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    if (!identity) return [];
    return await ctx.db
      .query('projects')
      .withIndex('by_owner', (q) => q.eq('ownerId', identity.subject))
      .take(args.limit);
  },
});

export const get = query({
  args: {},

  handler: async (ctx) => {
    const identity = await verifyAuth(ctx);

    if (!identity) return [];
    return await ctx.db
      .query('projects')
      .withIndex('by_owner', (q) => q.eq('ownerId', identity.subject))
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id('projects'),
  },

  handler: async (ctx, args) => {
    const project = await ctx.db.get('projects', args.id);
    const identity = await verifyAuth(ctx);

    if (!identity) return null;
    if (!project) {
      return null;
    }
    if (project.ownerId !== identity.subject) {
      return null;
    }
    return project;
  },
});

export const rename = mutation({
  args: {
    id: v.id('projects'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    if (!identity) return null;
    const project = await ctx.db.get('projects', args.id);
    if (!project) {
      return null;
    }
    if (project.ownerId !== identity.subject) {
      return null;
    }
    await ctx.db.patch(args.id, {
      name: args.name,
      updatedAt: Date.now(),
    });
    return project;
  },
});
