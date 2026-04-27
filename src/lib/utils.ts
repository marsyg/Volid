import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Doc, Id } from '../../convex/_generated/dataModel';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildPath(file: Id<'files'>, fileMap: Map<string, Doc<'files'>>): string[] {
  const path = [];
    let current = fileMap.get(file);
    
  while (current) {
      path.push(current.name);
      let parent
      if(current.parentId)
        parent = fileMap.get(current.parentId);
    if (parent) {
      current = parent;
    } else {
      break;
    }
  }
  return path.reverse();
}