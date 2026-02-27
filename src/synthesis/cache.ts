import { createStorage } from "unstorage";
import fsLiteDriver from "unstorage/drivers/fs-lite";
import { SYNTHESIS_CACHE_DIR } from "../constants";

const storage = createStorage({
  driver: fsLiteDriver({ base: SYNTHESIS_CACHE_DIR }),
});

/** Return a cached result if available, otherwise run `fn` and persist it. */
export async function cachedGenerate<T>(
  key: string,
  fn: () => Promise<T | undefined>,
): Promise<T | undefined> {
  const cached = await storage.getItem<T>(key);
  if (cached != null) return cached;

  const result = await fn();
  if (result != null)
    await storage.setItem(key, result as Record<string, unknown>);

  return result;
}

export async function clearTaskCache(taskPrefix: string) {
  await storage.clear(taskPrefix);
}

export async function getCacheKeys(taskPrefix?: string): Promise<string[]> {
  return storage.getKeys(taskPrefix);
}

export async function clearCache() {
  await storage.clear();
}
