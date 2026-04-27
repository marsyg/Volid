import { Doc, Id } from "../../convex/_generated/dataModel";
import { useFile } from "@/features/projects/hooks/use-file";
import { useEditorStore } from "@/features/editor/store/useEditorStore";

export const usePath = (fileId: Id<"files"> , projectId: Id<"projects">) => {
    const file = useFile(fileId, projectId);
    const name = file?.name;
    const parent = file?.parentId;
    const path = [];
    path.push(name)
    if (parent) {
      usePath(parent, projectId)
    }
    return path.reverse();
};
