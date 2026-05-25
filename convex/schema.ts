import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    ownerId: v.string(),
    updatedAt: v.number(),
    importStatus: v.optional(
      v.union(
        v.literal('imported'),
        v.literal('completed'),
        v.literal('failed'),
      ),
    ),
    exportStatus: v.optional(
      v.union(
        v.literal('exporting'),
        v.literal('failed'),
        v.literal('completed'),
        v.literal('cancelled'),
      ),
    ),
    
    exportUrl: v.optional(v.string()),
  })
      .index('by_owner', ['ownerId']),
    
  files: defineTable({
    projectId: v.id('projects'),
    parentId: v.optional(v.id('files')),    
    name: v.string(),
    updatedAt: v.number(),
    content: v.optional(v.string()),
    type: v.union(v.literal('file'), v.literal('folder')),
    storageID: v.optional(v.id("_storage")),
  })
      .index("by_project", ['projectId'])
      .index("by_parent", ['parentId'])
        .index("by_project_parent", ['projectId', 'parentId']),
  
  agentMessages: defineTable({
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
    createdAt: v.number(),
  })
    .index('by_project_user_created', ['projectId', 'userId', 'createdAt'])
    .index('by_run', ['runId']),

  
  agentMemory: defineTable({
    userId: v.string(),
    projectId: v.id('projects'),
    summary: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_project_user', ['projectId', 'userId']),


  agentRuns: defineTable({
    userId: v.string(),
    projectId: v.id('projects'),
    runId: v.string(),
    status: v.union(
      v.literal('pending'),
      v.literal('running'),
      v.literal('completed'),
      v.literal('failed'),
      ),
    prompt: v.string(),
    result: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    error: v.optional(v.string()),
  })
    .index('by_project_user', ['projectId', 'userId'])
    .index('by_run', ['runId'])
    .index('by_status', ['status'])
    .index('by_project_created', ['projectId', 'createdAt']),
});
