import { getCollection, type CollectionEntry } from "astro:content";

export type Doc = CollectionEntry<"docs">;

export const docHref = (doc: Doc) => (doc.id === "index" ? "/docs/" : `/docs/${doc.id}/`);

export async function getDocs(): Promise<Doc[]> {
  return (await getCollection("docs")).sort((a, b) => a.data.order - b.data.order);
}

/** Docs grouped by section, in order of first appearance. */
export function groupDocs(docs: Doc[]): [string, Doc[]][] {
  const groups = new Map<string, Doc[]>();
  for (const doc of docs) {
    const list = groups.get(doc.data.section) ?? [];
    list.push(doc);
    groups.set(doc.data.section, list);
  }
  return [...groups.entries()];
}
