
import { WebContainer } from '@webcontainer/api';

let containerPromise: Promise<WebContainer> | null = null;

export function getContainer() {
  if (!containerPromise) containerPromise = WebContainer.boot();
  return containerPromise;
}