export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (error?.name === 'AbortError') return fallback;
    console.error('Async error:', error);
    return fallback;
  }
}
