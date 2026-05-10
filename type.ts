type ContextSelection =
  | { type: "codebase" }
  | { type: "current-file" }
  | { type: "selection" }
  | { type: "file"; id: string }
  | { type: "folder"; id: string };

export type ContextOption =
  | {
      type: "item";
      label: string;
      value: ContextSelection;
    }
  | {
      type: "submenu";
      label: string;
      children: {
        label: string;
        value: ContextSelection;
      }[];
    };
