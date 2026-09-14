import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const supported = /\.(html|css|json|svg|js)$/i;

// Windows can notify on unchanged files, including while readers traverse
// the library. Only a content change should enter the rebuild queue.
export async function contentWatcher(root, directories) {
  const hashes = new Map();
  async function digest(file) {
    try { return createHash('sha256').update(await readFile(file)).digest('hex'); }
    catch (error) {
      if (error.code === 'ENOENT' || error.code === 'EISDIR') return null;
      throw error;
    }
  }
  async function seed(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await seed(file);
      else if (entry.isFile() && supported.test(entry.name)) hashes.set(file, await digest(file));
    }
  }
  await Promise.all(directories.map(dir => seed(path.join(root, dir))));
  return async (dir, name) => {
    if (!name || !supported.test(String(name))) return false;
    const file = path.resolve(root, dir, String(name));
    const previous = hashes.get(file) ?? null;
    const next = await digest(file);
    if (next === previous) return false;
    if (next === null) hashes.delete(file);
    else hashes.set(file, next);
    return true;
  };
}
