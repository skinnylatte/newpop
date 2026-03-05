// Import prior to `module.exports` within `.eleventy.js`
const { DateTime } = require("luxon");

// add syntax highlighting 
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

// 11ty youtube plugin

const embedYouTube = require("eleventy-plugin-youtube-embed");

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
const pluginRss = require("@11ty/eleventy-plugin-rss")

// requiring collections js
const collections = require("./collections.js");

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// all configs

module.exports = async function (eleventyConfig) {
  // import Eleventy plugins that are ESM
  const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");
  // adding alias
  eleventyConfig.addCollection("aliases", function(collectionApi) {
  let aliases = [];
  
  collectionApi.getAll().forEach(function(item) {
    if (item.data.aliases) {
      item.data.aliases.forEach(function(alias) {
        aliases.push({
          url: alias,
          redirect: item.url
        });
      });
    }
  });
  
  return aliases;
});

eleventyConfig.addCollection("redirects", function(collectionApi) {
  let redirects = [];
  
  collectionApi.getAll().forEach(function(item) {
    if (item.data.aliases) {
      item.data.aliases.forEach(function(alias) {
        redirects.push({
          from: alias,
          to: item.url,
          title: item.data.title
        });
      });
    }
  });
  
  return redirects;
});
  // add youtube lite embed shortcode (facade pattern for performance)
  eleventyConfig.addShortcode("youtube", function(videoId, title = "YouTube video") {
    return `<div class="youtube-lite" data-videoid="${videoId}">
      <img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="${title}" loading="lazy">
    </div>`;
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

  // Disabled YouTube plugin to avoid JSDelivr CDN blocking - use {% youtube %} shortcode instead
  // eleventyConfig.addPlugin(embedYouTube, {
  //   lazy: true,
  //   modestBranding: true,
  //   noCookie: true,
  //   embedClass: "youtube-embed",
  //   lite: true,
  // });
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


	// markdown options
	let options = {
		html: true,
		breaks: true,
		linkify: false
	};

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
	eleventyConfig.addCollection("tagList", function(collectionApi){
  let tags = new Set();
  collectionApi.getAll().forEach(function(item) {
    if ("tags" in item.data) {
      item.data.tags.filter(tag => !['all', 'posts'].includes(tag)).forEach(tag => {
        // Normalize tags: lowercase and replace spaces with hyphens
        const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-');
        tags.add(normalizedTag);
      });
    }
  });
  return Array.from(tags).sort();
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
