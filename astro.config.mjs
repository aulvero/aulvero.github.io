// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

/** Wrap markdown tables in a scrollable container so wide tables never break the layout. */
function rehypeWrapTables() {
  /** @param {any} node */
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((/** @type {any} */ child) => {
      walk(child);
      if (child.type === "element" && child.tagName === "table") {
        return { type: "element", tagName: "div", properties: { className: ["table-wrap"] }, children: [child] };
      }
      return child;
    });
  };
  return walk;
}

export default defineConfig({
  site: "https://aulvero.github.io",
  integrations: [sitemap()],
  trailingSlash: "ignore",
  markdown: {
    shikiConfig: { theme: "vesper", wrap: false },
    rehypePlugins: [rehypeWrapTables],
  },
});
