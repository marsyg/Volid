export const BASE_PADDING = 12

export const LEVEL_PADDING = 12;

export const getItemPadding = (level: number, isFile: boolean) => {
  const fileOffset = isFile ? 16 : 0;
  return BASE_PADDING + level * LEVEL_PADDING + fileOffset;
};

export const FILE_EXPLORER_KEY_BINDINGS = {
  rename: { key: 'Enter', label: 'Enter', description: 'Rename item' },
  delete: { key: 'Delete', label: 'Delete', description: 'Delete item' },
  createFile: { key: 'f', label: 'F', description: 'New file' },
  createFolder: { key: 'd', label: 'D', description: 'New folder' },
  cancel: { key: 'Escape', label: 'Escape', description: 'Cancel action' },
  openInTerminal: { key: '`', ctrl: true, label: 'Ctrl + `', description: 'Open in Integrated Terminal' },
} as const;