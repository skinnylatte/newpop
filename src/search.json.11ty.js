function stripHtml(value) {
  return (value || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(title, fallback) {
  if (typeof title === "string") {
    var trimmed = title.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  if (title && typeof title === "object") {
    var candidateKeys = Object.keys(title).filter(function (key) {
      return typeof key === "string" && key.trim() && key !== "[object Object]";
    });

    if (candidateKeys.length > 0) {
      return candidateKeys[0];
    }
  }

  return fallback;
}

module.exports = class SearchIndex {
  data() {
    return {
      permalink: "/search.json",
      eleventyExcludeFromCollections: true
    };
  }

  render(data) {
    var feedposts = Array.isArray(data.collections.feedposts)
      ? data.collections.feedposts
      : [];

    var results = feedposts.map(function (item) {
      var fallbackTitle = (item.page && item.page.fileSlug) || "Untitled";
      var title = normalizeTitle(item.data && item.data.title, fallbackTitle);
      var bodyText = stripHtml(item.templateContent || "");
      var tags = Array.isArray(item.data && item.data.tags)
        ? item.data.tags.filter(function (tag) {
            return tag !== "posts" && tag !== "all";
          })
        : [];
      var searchText = [title, bodyText, tags.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return {
        title: title,
        url: item.url,
        date: item.date instanceof Date ? item.date.toISOString() : "",
        excerpt: bodyText.slice(0, 240),
        tags: tags,
        searchText: searchText
      };
    });

    return JSON.stringify(results, null, 2);
  }
};
