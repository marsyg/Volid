import { useEffect, useRef } from "react";
import { buildTree } from "../../../lib/buildTree";
import { useFiles } from "./use-file";
import { getContainer } from "@/lib/webcontainer";
import { Id, Doc } from "../../../../convex/_generated/dataModel";
import { useEditorStore } from "../../editor/store/useEditorStore";

export function useWebContainer(projectId: Id<"projects">) {
    const files = useFiles(projectId);
    const setPreviewUrl = useEditorStore((state) => state.setPreviewUrl);
    const setWebContainerMounted = useEditorStore((state) => state.setWebContainerMounted);
    const mountedProjectIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!files || files.length === 0) return;
        if (mountedProjectIdRef.current === projectId) return;
        let isCancelled = false;

        async function init(filesToMount: Doc<"files">[]) {
            try {
                const container = await getContainer();
                if (isCancelled) return;

                const tree = buildTree(filesToMount);
                await container.mount(tree);

                container.on("server-ready", (port, url: string) => {
                    console.log(`[WebContainer] Dev server running at ${url}:${port}`);
                    setPreviewUrl(url);
                });

                if (!isCancelled) {
                    setWebContainerMounted(true);
                    mountedProjectIdRef.current = projectId;
                }
            } catch (err) {
                console.error("[WebContainer] mount error:", err);
            }
        }

        init(files);

        return () => {
            isCancelled = true;
        };
    }, [files, projectId, setPreviewUrl, setWebContainerMounted]);

    return { files };
}
