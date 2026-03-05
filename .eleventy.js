// Import prior to `module.exports` within `.eleventy.js`
const { DateTime } = require("luxon");

// add syntax highlighting 
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

// adding markdown filters
const markdownIt = require("markdown-it");

// adding markdown anchors
const markdownItAnchor = require("markdown-it-anchor");
const slugify = require("slugify");

// anchor links

const linkAfterHeader = markdownItAnchor.permalink.linkAfterHeader({
  class: "anchor",
  symbol: "<span hidden>#</span>",
  style: "aria-labelledby",
});

const markdownItAnchorOptions = {
  level: [1, 2, 3],
  slugify: (str) =>
    slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    }),
  tabIndex: false,
  permalink(slug, opts, state, idx) {
    state.tokens.splice(
      idx,
      0,
      Object.assign(new state.Token("div_open", "div", 1), {
        // Add class "header-wrapper [h1 or h2 or h3]"
        attrs: [["class", `heading-wrapper ${state.tokens[idx].tag}`]],
        block: true,
      })
    );

    state.tokens.splice(
      idx + 4,
      0,
      Object.assign(new state.Token("div_close", "div", -1), {
        block: true,
      })
    );

    linkAfterHeader(slug, opts, state, idx + 1);
  },
};

/* Markdown Overrides */
let markdownLibrary = markdownIt({
  html: true,
}).use(markdownItAnchor, markdownItAnchorOptions);

//adding rss
const pluginRss = require("@11ty/eleventy-plugin-rss");

// requiring collections js
const collections = require("./collections.js");

const watchIgnorePatterns = [
  "_site/**",
  "_site_a11y/**",
  "_site_verify/**",
  "docs/**",
];

const TAG_PAGE_SIZE = Math.max(1, Number.parseInt(process.env.TAG_PAGE_SIZE || "20", 10));

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeTag(tag) {
  return String(tag || "").toLowerCase().trim().replace(/\s+/g, "-");
}

function getItemTags(item) {
  const rawTags = item && item.data ? item.data.tags : [];
  return Array.isArray(rawTags) ? rawTags : rawTags ? [rawTags] : [];
}

function buildAliasEntries(collectionApi) {
  const aliases = [];
  const items = collectionApi.getAll();
  for (const item of items) {
    const itemAliases = Array.isArray(item.data.aliases) ? item.data.aliases : [];
    for (const alias of itemAliases) {
      aliases.push({ item, alias });
    }
  }
  return aliases;
}

function buildNormalizedTagMap(collectionApi, ignoredTags) {
  const tagMap = new Map();
  const ignored = new Set(Array.from(ignoredTags || []).map((tag) => normalizeTag(tag)));

  for (const item of collectionApi.getAll()) {
    const tags = getItemTags(item);
    if (!tags.length) {
      continue;
    }

    // Guard against duplicate tags on a single post after normalization.
    const seenForItem = new Set();
    for (const tag of tags) {
      const normalized = normalizeTag(tag);
      if (!normalized || ignored.has(normalized) || seenForItem.has(normalized)) {
        continue;
      }
      seenForItem.add(normalized);
      if (!tagMap.has(normalized)) {
        tagMap.set(normalized, []);
      }
      tagMap.get(normalized).push(item);
    }
  }

  for (const posts of tagMap.values()) {
    posts.sort((a, b) => b.date - a.date);
  }

  return tagMap;
}

// all configs

module.exports = async function (eleventyConfig) {
  // Faster local dev: serve passthrough files directly and ignore generated/report folders.
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.setWatchThrottleWaitTime(100);
  watchIgnorePatterns.forEach((pattern) => eleventyConfig.watchIgnores.add(pattern));

  // import Eleventy plugins that are ESM
  const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");
  // adding alias
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
  // add youtube lite embed shortcode (facade pattern for performance)
  eleventyConfig.addShortcode("youtube", function(videoId, title = "YouTube video") {
    const safeVideoId = escapeHtml(String(videoId || "").trim());
    const safeTitle = escapeHtml(String(title || "YouTube video").trim());
    const buttonLabel = `Play video: ${safeTitle}`;
    return `<button class="youtube-lite" type="button" data-videoid="${safeVideoId}" aria-label="${buttonLabel}">
      <img src="https://i.ytimg.com/vi/${safeVideoId}/hqdefault.jpg" alt="" aria-hidden="true" loading="lazy">
    </button>`;
  });

  function renderImageTag(
    src,
    alt,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 720px",
    className = "",
    loading = "lazy",
    fetchpriority = "auto",
    decoding = "async"
  ) {
    const trimmedSrc = (src || "").trim();
    const trimmedAlt = (alt || "").trim();
    if (!trimmedSrc) {
      throw new Error("image shortcode requires src");
    }
    if (!trimmedAlt) {
      throw new Error(`image shortcode requires alt text for ${trimmedSrc}`);
    }

    // Keep the image shortcode API stable, but skip derivative generation.
    const attrs = [
      `src="${escapeHtml(trimmedSrc)}"`,
      `alt="${escapeHtml(trimmedAlt)}"`,
    ];
    if (loading) {
      attrs.push(`loading="${escapeHtml(loading)}"`);
    }
    if (decoding) {
      attrs.push(`decoding="${escapeHtml(decoding)}"`);
    }
    if (fetchpriority && fetchpriority !== "auto") {
      attrs.push(`fetchpriority="${escapeHtml(fetchpriority)}"`);
    }
    const cleanClass = (className || "").trim();
    if (cleanClass) {
      attrs.push(`class="${escapeHtml(cleanClass)}"`);
    }

    return `<img ${attrs.join(" ")}>`;
  }

  eleventyConfig.addAsyncShortcode(
    "image",
    async function(
      src,
      alt,
      className = "",
      sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 720px",
      loading = "lazy",
      fetchpriority = "auto",
      decoding = "async"
    ) {
      return renderImageTag(src, alt, sizes, className, loading, fetchpriority, decoding);
    }
  );

  eleventyConfig.addAsyncShortcode(
    "imageFigure",
    async function(
      src,
      alt,
      caption = "",
      sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 720px",
      loading = "lazy",
      fetchpriority = "auto",
      decoding = "async"
    ) {
      const trimmedAlt = (alt || "").trim();
      const picture = renderImageTag(src, trimmedAlt, sizes, "", loading, fetchpriority, decoding);
      const finalCaption = (caption || trimmedAlt).trim();
      return `<figure class="post-image">
  ${picture}
  <figcaption>${escapeHtml(finalCaption)}</figcaption>
</figure>`;
    }
  );

  // Google Slides shortcode
  eleventyConfig.addShortcode("googleSlides", function(id, width = 960, height = 569, title = "Embedded Google Slides Presentation") {
  return `<div class="slideshow-container">
    <iframe src="https://docs.google.com/presentation/d/e/${id}/embed?start=false&loop=false&delayms=3000"
      frameborder="0"
      width="${width}"
      height="${height}"
      allowfullscreen="true"
      mozallowfullscreen="true"
      webkitallowfullscreen="true"
      loading="lazy"
      title="${title}">
    </iframe>
  </div>`;
});

  // add syntax highlighting
eleventyConfig.addPlugin(syntaxHighlight);

  // add html base plugin
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // add rss
  eleventyConfig.addPlugin(pluginRss);

  //  anchor links on content
  eleventyConfig.setLibrary("md", markdownLibrary);


	// passthrough info

	["./src/favicon.ico", "./src/favicon.svg", "./src/style.css", "./src/youtube-lite.css", "./src/youtube-lite.js", "./src/photos/uploads", "./src/img", "./src/assets"].forEach(path => {
		eleventyConfig.addPassthroughCopy(path);
	});

	// dates

	eleventyConfig.addFilter("postDate", (dateObj) => {
  return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
});

	eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);
	
	//  slugify settings

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

	// create a list of tags for archive page
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


		  // add a filter for limiting the no of posts in rss
  eleventyConfig.addFilter("head", (array, number) => {
  return array.slice(-number);
});
  
 

	// create a custom collection for feed post

	eleventyConfig.addCollection("feedposts", function (collectionApi) {
		const posts = collectionApi.getAllSorted().filter(item => {
			const inputPath = item.inputPath;
			return inputPath.includes('/posts/') ||
				   inputPath.includes('/photos/') ||
				   inputPath.includes('/food/') ||
				   inputPath.includes('/bikes/') ||
				   inputPath.includes('/now/');
		});

		// Sort by date descending (newest first)
		return posts.sort((a, b) => b.date - a.date);
	});


  // loop through collections created in collections
  
  Object.keys(collections).forEach((collectionName) => {
    eleventyConfig.addCollection(collectionName, collections[collectionName]);
  });
  
	// set custom directories for input, output includes and data
	return {
		// when a passthrough file is modified, rebuild the pages
		passthroughFileCopy: true,
		dir: {
			input: "src",
			includes: "_includes",
			data: "_data",
			output: "_site"
		}
	};
};
