import z from "zod"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"
import { ToolDefinition, ToolContext, ToolResult } from "./type"

const listFileInput = z.object({
    fileId: z.string()    
})
const writeFileInput = z.object({
    fileId: z.string(),
    content: z.string(),
})
const createFileInput = z.object({
    
    parentId: z.string(),
    name: z.string(),
    content: z.string(),
    type: z.union([z.literal('file'), z.literal('folder')]),
})
export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
    
   "listFile": {
       name: "listFile",
       description: "list all the files in the project",
        inputSchema: listFileInput,
        execute: async (ctx: ToolContext, input: unknown) => {
          const { fileId } = listFileInput.parse(input)
          const { projectId, convex } = ctx
          
          const files = await convex.query(api.files.getFolderContents, { projectId : projectId,parentId  : fileId  as Id<"files">   })
            return { ok: true, data: files }
        }
    },
    "readFile": {
        name: "readFile",     
        description: "read the content of a file",
        inputSchema: listFileInput,
        execute: async (ctx: ToolContext, input: unknown) => {
          const { fileId } = listFileInput.parse(input)
          const { projectId, convex } = ctx
            const content = await convex.query(api.files.getFile, { projectId : projectId, fileId : fileId as Id<"files"> })
            return { ok: true, data: content }
        }
    },
    "createRenderResumeDataCache": {
        name: "createRenderResumeDataCache",
        description: "create a render resume data cache",
        inputSchema: z.object({}),
        execute: async () => {
            return { ok: true, data: [] }
        }
    },
    "searchFile": {
        name: "searchFile",
        description: "search for a file",
        inputSchema: z.object({}),
        execute: async () => {
            return { ok: true, data: [] }
        }
    },
    "writeFile": {  
        name: "writeFile",
        description: "write a file",
        inputSchema: writeFileInput,
        execute: async (ctx: ToolContext, input: unknown) => {
            const { fileId, content } = writeFileInput.parse(input)
            const { convex } = ctx
            const writeFile = await convex.mutation(api.files.updateFile, { fileId : fileId as Id<"files">, content })
            return { ok: true, data: writeFile }
        }
    },
    "createFile": {
        name: "createFile",
        description: "create a file",
        inputSchema: createFileInput,
        execute: async (ctx: ToolContext, input: unknown) => {
            const { projectId, convex } = ctx
            const { parentId, name, content, type } = createFileInput.parse(input)
            const createFile = await convex.mutation(api.files.createFile, { parentId: parentId as Id<"files"> , projectId: projectId as Id<"projects">,    name, content, type : 'file' })
            return { ok: true, data: createFile }
        }
    },
    "createDirectory": {
        name: "createDirectory",
        description: "create a directory",
        inputSchema: createFileInput,
        execute: async (ctx: ToolContext, input: unknown) => {
            const { projectId, convex } = ctx
            const { parentId, name, content, type } = createFileInput.parse(input)
            const createDirectory = await convex.mutation(api.files.createFolder, { parentId: parentId as Id<"files">, projectId: projectId as Id<"projects">, name,  })
            return { ok: true, data: createDirectory }
        }
    }
}
