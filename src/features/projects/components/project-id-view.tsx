"use client";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import TabBar from "./tab-bar";
import { Allotment } from "allotment";
import { DEFAULT_MAIN_SIZE, DEFAULT_SIDEBAR_WIDTH, MAX_SIDEBAR_WIDTH, MIN_SIDEBAR_WIDTH } from "@/consant";

import "allotment/dist/style.css";  
import { FileExplorer } from "@/features/projects/components/fileExplorer";
export const ProjectIdView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
    return (
        <div className="flex flex-col h-screen">
            <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
            {
                activeTab === "code" ? (<div className="flex-1 overflow-hidden">
                    <Allotment defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}>
                        <Allotment.Pane snap
                            minSize={MIN_SIDEBAR_WIDTH}
                            maxSize={MAX_SIDEBAR_WIDTH}
                            preferredSize={DEFAULT_SIDEBAR_WIDTH}

                        >
                            <FileExplorer projectId={projectId} />
                        </Allotment.Pane>
                        <Allotment.Pane
                            minSize={MIN_SIDEBAR_WIDTH}
                            maxSize={MAX_SIDEBAR_WIDTH}
                            preferredSize={DEFAULT_SIDEBAR_WIDTH}
                        >
                            EDITOR
                        </Allotment.Pane>
                    </Allotment>
                </div>) : (<div className="flex-1">
                    preview
                </div>)
            }
        </div>
    );
};