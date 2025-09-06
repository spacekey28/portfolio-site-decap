// Vite will copy anything under /content into the build (since it's not under /public).
// We'll fetch Markdown at runtime and parse it.
import matter from "gray-matter";
// Ensure Buffer exists in browser for gray-matter internals
// Vite will tree-shake if unused elsewhere
import { Buffer as BufferPolyfill } from "buffer";
if (typeof window !== 'undefined' && typeof (window as any).Buffer === 'undefined') {
  (window as any).Buffer = BufferPolyfill;
}
import { marked } from "marked";

export async function fetchMarkdown(path: string) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  const raw = await res.text();
  const { data, content } = matter(raw);
  const html = marked.parse(content);
  return { data, html };
}

export type Project = {
  slug: string;
  title: string;
  date?: string;
  summary?: string;
  thumbnail?: string;
  tech?: string;
};

// find all project files by convention (client-side needs a manifest):
// simplest approach: keep a JSON manifest (generated manually at first).
