// Import prior to `module.exports` within `.eleventy.js`
const { DateTime } = require("luxon");

// adding markdown filters
const markdownIt = require("markdown-it");

//adding rss
const pluginRss = require("@11ty/eleventy-plugin-rss")


// adding html base plugin

const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

// adding passthrough declarations and directories

module.exports = function (eleventyConfig) {
  // add rss
  eleventyConfig.addPlugin(pluginRss);

	// markdown options
	let options = {
		html: true,
		breaks: true,
		linkify: true
	};
  // adding html base plugin
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);


	["src/favicon.ico", "src/style.css", "src/photos/uploads", "src/img"].forEach(path => {
		eleventyConfig.addPassthroughCopy(path);
	});
	eleventyConfig.addFilter("postDate", (dateObj) => {
  return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
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

	// create a custom feed list for rss
	eleventyConfig.addCollection("feed", function(collectionApi){
		 return collectionApi.getFilteredByGlob(["blog/*.md", "photos/*.md", "bikes/*.md"]);
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

