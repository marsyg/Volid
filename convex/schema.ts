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
  
});
