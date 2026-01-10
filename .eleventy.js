// Import prior to `module.exports` within `.eleventy.js`
const { DateTime } = require("luxon");

// add syntax highlighting 
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

// 11ty img plugin

const Image = require("@11ty/eleventy-img");

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
		return collectionApi.getFilteredByGlob(["./src/posts/*.md", "./src/photos/*.md", "./src/food/*.md", "./src/bikes/*.md", "./src/now/*.md"]);
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

