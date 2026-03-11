const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

const collections = require("./collections.js");

const { createMarkdownLibrary } = require("./config/eleventy/markdown");
const {
  escapeHtml,
  buildAliasEntries,
  buildNormalizedTagMap,
} = require("./config/eleventy/helpers");
const { registerShortcodes } = require("./config/eleventy/shortcodes");
const { registerFilters } = require("./config/eleventy/filters");
const { registerCollections } = require("./config/eleventy/collections");
const { registerPassthrough } = require("./config/eleventy/passthrough");

const WATCH_IGNORE_PATTERNS = [
  "_site/**",
  "_site_a11y/**",
  "_site_verify/**",
  "docs/**",
];

const TAG_PAGE_SIZE = Math.max(1, Number.parseInt(process.env.TAG_PAGE_SIZE || "20", 10));

module.exports = async function (eleventyConfig) {
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.setWatchThrottleWaitTime(100);
  WATCH_IGNORE_PATTERNS.forEach((pattern) => eleventyConfig.watchIgnores.add(pattern));

  const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");

  registerShortcodes(eleventyConfig, { escapeHtml });
  registerFilters(eleventyConfig, { DateTime, pluginRss });
  registerCollections(eleventyConfig, {
    buildAliasEntries,
    buildNormalizedTagMap,
    TAG_PAGE_SIZE,
    collectionsModule: collections,
  });

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.setLibrary("md", createMarkdownLibrary());
  registerPassthrough(eleventyConfig);

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
