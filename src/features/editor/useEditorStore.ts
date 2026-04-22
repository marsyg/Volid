import { create } from "zustand";
import { Id } from "../../../convex/_generated/dataModel";
interface EditorStore {
    tabs: Map<Id<"projects">, TabState>
    getTabState: (project: Id<"projects">) => TabState;
    openFile: (projectId: Id<"projects">, fileId: Id<"files">, { pinned }: { pinned?: boolean }) => void;
    closeTab: (projectId: Id<"projects">, fileId: Id<"files">) => void;
    closeAll: (projectId: Id<"projects">) => void;
    setActiveTab: (projectId: Id<"projects">, fileId: Id<"files"> | null) => void;
}
interface TabState {
    activeTabId: Id<"files"> | null;
    previewTabId: Id<"files"> | null;
    openTabs: Id<"files">[];
}

const defaultTabState: TabState = {
    activeTabId: null,
    previewTabId: null,
    openTabs: [],
};
export const useEditorStore = create<EditorStore>((set , get) => ({
  
    tabs: new Map(),
    getTabState: (project: Id<"projects">) => {
        const tabState = get().tabs.get(project);
        return tabState ?? defaultTabState;
    },
    openFile: (projectId: Id<"projects">, fileId: Id<"files">, { pinned }: { pinned?: boolean }) => {
        const tabs = new Map(get().tabs)
        const tabState = tabs.get(projectId) ?? defaultTabState;
        const { openTabs, previewTabId } = tabState;
        const isAlreadyOpen = openTabs.includes(fileId);
        if (!isAlreadyOpen && !pinned) {
            const newOpenTabs = previewTabId ? openTabs.map((id) => (id == previewTabId ? fileId : id)): [...openTabs , fileId];
            tabs.set(projectId, {
                 openTabs: newOpenTabs,
                 activeTabId: fileId,
                 previewTabId: fileId,
               });
               set({ tabs });
        } 
        if (!isAlreadyOpen && pinned) {
            tabs.set(projectId, {
                ...tabState,
                openTabs: [...tabState.openTabs, fileId],
                activeTabId: fileId,
            });
            set({ tabs });
        }
        const pinTab = pinned && previewTabId == fileId;
        tabs.set(projectId, {
            ...tabState,
            activeTabId: fileId,
            previewTabId : pinTab ? fileId : null
            
        });
        set({ tabs });
    },
    closeTab: (projectId: Id<"projects">, fileId: Id<"files">) => {
        const tabs = new Map(get().tabs)
        const tabState = tabs.get(projectId) ?? defaultTabState;
        const { openTabs, previewTabId, activeTabId } = tabState;
        
        const tabIndex = openTabs.indexOf(fileId);
       
        if (tabIndex === -1) return;
        
        const newTabs = openTabs.filter((id) => id !== fileId);
     
         let newActiveTabId = activeTabId;
         if (activeTabId === fileId) {
           if (newTabs.length === 0) {
             newActiveTabId = null;
           } else if (tabIndex >= newTabs.length) {
             newActiveTabId = newTabs[newTabs.length - 1];
           } else {
             newActiveTabId = newTabs[tabIndex];
           }
         }
        
        

        
        const newOpenTabs = openTabs.filter((id) => id !== fileId);
        const pinTab = previewTabId == fileId;
        tabs.set(projectId, {
            openTabs: newOpenTabs,
            activeTabId: newActiveTabId,
            previewTabId: pinTab ? newOpenTabs[0] ?? null : null,
        });
        set({ tabs });
    },
    closeAll: (projectId: Id<"projects">) => {
        const tabs = new Map(get().tabs);
        tabs.set(projectId, defaultTabState);
        set({ tabs });
    },
    setActiveTab: (projectId: Id<"projects"> | null, fileId: Id<"files"> | null) => {
        if (projectId === null || fileId === null) return;
        const tabs = new Map(get().tabs);
        const tabState = tabs.get(projectId) ?? defaultTabState;
        const { openTabs, previewTabId } = tabState;
        const pinTab = previewTabId == fileId;
        tabs.set(projectId, {
            openTabs,
            activeTabId: fileId,
            previewTabId: pinTab ? fileId : null,
        });
        set({ tabs });
    },
}));