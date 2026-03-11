const slugify = require("slugify");

function registerFilters(eleventyConfig, { DateTime, pluginRss }) {
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);

  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    return slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    });
  });

  eleventyConfig.addFilter("displayTags", (tags) => {
    const hiddenTags = new Set(["all", "posts", "post", "archives", "lists", "blog"]);
    const list = Array.isArray(tags) ? tags : typeof tags === "string" ? [tags] : [];
    const seen = new Set();

    return list.reduce((acc, tag) => {
      if (!tag) {
        return acc;
      }
      const cleanTag = String(tag).trim();
      const key = cleanTag.toLowerCase();
      if (!cleanTag || hiddenTags.has(key) || seen.has(key)) {
        return acc;
      }
      seen.add(key);
      acc.push(cleanTag);
      return acc;
    }, []);
  });

  eleventyConfig.addFilter("head", (array, number) => {
    return array.slice(-number);
  });
}

module.exports = {
  registerFilters,
};
