import z from "zod"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"
import { ToolDefinition, ToolContext } from "./type"

const listFileInput = z.object({
    fileId: z.string().optional(),
    parentId: z.string().optional(),
})
const readFileInput = z.object({
    fileId: z.string(),
})
const writeFileInput = z.object({
    fileId: z.string(),
    content: z.string(),
})
const createFileInput = z.object({
    parentId: z.string().optional(),
    name: z.string(),
    content: z.string(),
})
const createDirectoryInput = z.object({
    parentId: z.string().optional(),
    name: z.string(),
})
export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
    
   "listFile": {
       name: "listFile",
       description: "list files in a project folder. Omit parentId/fileId to list the project root.",
        inputSchema: listFileInput,
        execute: async (ctx: ToolContext, input: unknown) => {
          const { fileId, parentId } = listFileInput.parse(input)
          const { userId, projectId, convex } = ctx
          const folderId = parentId ?? fileId
          
          const files = await convex.query(api.agentFiles.getFolderContents, {
            userId,
            projectId,
            parentId: folderId ? folderId as Id<"files"> : undefined,
          })
            return { ok: true, data: files }
        }
    },
    "readFile": {
        name: "readFile",     
        description: "read the content of a file",
        inputSchema: readFileInput,
        execute: async (ctx: ToolContext, input: unknown) => {
          const { fileId } = readFileInput.parse(input)
          const { userId, projectId, convex } = ctx
            const content = await convex.query(api.agentFiles.getFile, {
                userId,
                projectId,
                fileId : fileId as Id<"files">,
            })
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
            const { userId, convex } = ctx
            const writeFile = await convex.mutation(api.agentFiles.updateFile, {
                userId,
                fileId : fileId as Id<"files">,
                content,
            })
            return { ok: true, data: writeFile }
        }
    },
    "createFile": {
        name: "createFile",
        description: "create a file",
        inputSchema: createFileInput,
        execute: async (ctx: ToolContext, input: unknown) => {
            const { userId, projectId, convex } = ctx
            const { parentId, name, content } = createFileInput.parse(input)
            const createFile = await convex.mutation(api.agentFiles.createFile, {
                userId,
                parentId: parentId ? parentId as Id<"files"> : undefined,
                projectId,
                name,
                content,
            })
            return { ok: true, data: createFile }
        }
    },
    "createDirectory": {
        name: "createDirectory",
        description: "create a directory",
        inputSchema: createDirectoryInput,
        execute: async (ctx: ToolContext, input: unknown) => {
            const { userId, projectId, convex } = ctx
            const { parentId, name } = createDirectoryInput.parse(input)
            const createDirectory = await convex.mutation(api.agentFiles.createFolder, {
                userId,
                parentId: parentId ? parentId as Id<"files"> : undefined,
                projectId,
                name,
            })
            return { ok: true, data: createDirectory }
        }
    }
}
