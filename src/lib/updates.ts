import { getCollection } from "astro:content";

export async function getUpdates() {
  return (await getCollection("updates")).sort((a, b) =>
    b.data.date.getTime() - a.data.date.getTime() || a.data.order - b.data.order);
}

export const formatDate = (date: Date) => date.toLocaleDateString("en-GB", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
});
