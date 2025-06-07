// Import prior to `module.exports` within `.eleventy.js`
const { DateTime } = require("luxon");

// add syntax highlighting 
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

// 11ty img plugin

const Image = require("@11ty/eleventy-img");

// 11ty youtube plugin

const embedYouTube = require("eleventy-plugin-youtube-embed");

// html base plugin

const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

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

module.exports = function (eleventyConfig) {
  // add youtube embed block
  eleventyConfig.addPlugin(embedYouTube);

  // add google slides block
  // Google Slides shortcode
  eleventyConfig.addShortcode("googleSlides", function(id, width = 960, height = 569) {
    return `<div class="slideshow-container">
      <iframe src="https://docs.google.com/presentation/d/e/${id}/embed?start=false&loop=false&delayms=3000" 
        frameborder="0" 
        width="${width}" 
        height="${height}" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true">
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

	["./src/favicon.ico", "./src/style.css", "./src/photos/uploads", "./src/img"].forEach(path => {
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
      item.data.tags.filter(tag => !['all', 'posts'].includes(tag)).forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags);
});

	  // add a filter for limiting the no of posts in rss
  eleventyConfig.addFilter("head", (array, number) => {
  return array.slice(-number);
});
  
 

	// create a custom collection for feed post

	eleventyConfig.addCollection("feedposts", function (collectionApi) {
		return collectionApi.getFilteredByGlob(["./src/posts/*.md", "./src/photos/*.md", "./src/food/*.md", "./src/bikes/*.md"]);
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

