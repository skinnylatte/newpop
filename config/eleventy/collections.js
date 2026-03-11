function registerCollections(
  eleventyConfig,
  { buildAliasEntries, buildNormalizedTagMap, TAG_PAGE_SIZE, collectionsModule }
) {
  eleventyConfig.addCollection("aliases", function (collectionApi) {
    return buildAliasEntries(collectionApi).map(({ item, alias }) => ({
      url: alias,
      redirect: item.url,
    }));
  });

  eleventyConfig.addCollection("redirects", function (collectionApi) {
    return buildAliasEntries(collectionApi).map(({ item, alias }) => ({
      from: alias,
      to: item.url,
      title: item.data.title,
    }));
  });

  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const tagMap = buildNormalizedTagMap(collectionApi, new Set(["all", "posts"]));
    return Array.from(tagMap.keys()).sort();
  });

  eleventyConfig.addCollection("tagPages", function (collectionApi) {
    const tagMap = buildNormalizedTagMap(collectionApi, new Set(["all", "posts"]));
    const pages = [];

    Array.from(tagMap.keys())
      .sort()
      .forEach((tag) => {
        const posts = tagMap.get(tag) || [];

        if (!posts.length) {
          return;
        }

        const totalPages = Math.ceil(posts.length / TAG_PAGE_SIZE);
        for (let pageNumber = 0; pageNumber < totalPages; pageNumber++) {
          const start = pageNumber * TAG_PAGE_SIZE;
          pages.push({
            tag,
            posts: posts.slice(start, start + TAG_PAGE_SIZE),
            totalPosts: posts.length,
            pageNumber,
            totalPages,
          });
        }
      });

    return pages;
  });

  eleventyConfig.addCollection("feedposts", function (collectionApi) {
    const posts = collectionApi.getAllSorted().filter((item) => {
      const inputPath = item.inputPath;
      return (
        inputPath.includes("/posts/") ||
        inputPath.includes("/photos/") ||
        inputPath.includes("/food/") ||
        inputPath.includes("/bikes/") ||
        inputPath.includes("/now/")
      );
    });

    return posts.sort((a, b) => b.date - a.date);
  });

  Object.keys(collectionsModule).forEach((collectionName) => {
    eleventyConfig.addCollection(collectionName, collectionsModule[collectionName]);
  });
}

module.exports = {
  registerCollections,
};
