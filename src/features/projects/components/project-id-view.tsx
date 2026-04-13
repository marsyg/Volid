"use client";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import TabBar from "./tab-bar";
export const ProjectIdView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
    return (
        <div>
            <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
            {
                activeTab === "code" ? (<div>
                    code
                </div>) : (<div>
                    preview
                </div>)
            }
        </div>
    );
};