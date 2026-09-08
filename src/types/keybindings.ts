import type React from 'react';

/**
 * Standard keyboard key identifiers supported across modern browsers
 */
export type SpecialKey =
  | 'Enter'
  | 'Escape'
  | 'Backspace'
  | 'Delete'
  | 'Tab'
  | 'Space'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Home'
  | 'End'
  | 'PageUp'
  | 'PageDown';

export type AlphabetKey =
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j'
  | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't'
  | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';

export type DigitKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type KeyCode = SpecialKey | AlphabetKey | DigitKey | (string & {});

/**
 * Modifier keys that can accompany a keypress
 */
export interface KeyModifiers {
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
}

/**
 * Representation of a key binding configuration
 */
export interface KeyBinding extends KeyModifiers {
  key: KeyCode;
  label?: string; // Display label for UI/shortcuts badge (e.g. "Enter", "Del", "⌘B")
  description?: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

/**
 * Generic action-bound keybinding
 */
export interface ActionKeyBinding<TAction extends string = string> extends KeyBinding {
  action: TAction;
}

/**
 * File Explorer specific keyboard actions
 */
export type FileExplorerAction =
  | 'rename'
  | 'delete'
  | 'createFile'
  | 'createFolder'
  | 'open'
  | 'cancel';

/**
 * File Explorer keybinding configuration dictionary
 */
export type FileExplorerKeyBindings = Record<FileExplorerAction, KeyBinding>;

/**
 * Global application actions & shortcut mappings
 */
export type GlobalAppAction =
  | 'toggleSidebar'
  | 'openCommandDialog'
  | 'newProject'
  | 'importProject';

export type GlobalAppKeyBindings = Record<GlobalAppAction, KeyBinding>;

/**
 * Checks whether a given KeyboardEvent satisfies a KeyBinding specification
 */
export function isKeyBindingMatch(
  event: KeyboardEvent | React.KeyboardEvent,
  binding: KeyBinding
): boolean {
  const matchesKey =
    event.key.toLowerCase() === binding.key.toLowerCase();

  if (!matchesKey) return false;

  const requiresCtrlOrMeta = binding.ctrl || binding.meta;
  if (requiresCtrlOrMeta) {
    const hasCtrlOrMeta = event.ctrlKey || event.metaKey;
    if (!hasCtrlOrMeta) return false;
  } else {
    // If neither ctrl nor meta is required, ensure neither is pressed (avoids triggering on Ctrl+F browser search)
    if (event.ctrlKey || event.metaKey) return false;
  }

  if (binding.shift !== undefined && event.shiftKey !== binding.shift) {
    return false;
  }

  if (binding.alt !== undefined && event.altKey !== binding.alt) {
    return false;
  }

  return true;
}
