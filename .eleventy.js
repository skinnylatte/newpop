// Import prior to `module.exports` within `.eleventy.js`
const { DateTime } = require("luxon");

// adding markdown filters
const markdownIt = require("markdown-it");


// adding passthrough declarations and directories

module.exports = function (eleventyConfig) {
	// markdown options
	let options = {
		html: true,
		breaks: true,
		linkify: true
	};

	["src/favicon.ico", "src/style.css", "src/photos/uploads", "src/img"].forEach(path => {
		eleventyConfig.addPassthroughCopy(path);
	});
	eleventyConfig.addFilter("postDate", (dateObj) => {
  return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
});
	// create a list of tags
	eleventyConfig.addCollection("tagList", function(collectionApi){
	let tags = new Set();
  collectionApi.getAll().forEach(function(item) {
    if ("tags" in item.data) {
      item.data.tags.filter(tag => !['all', 'posts'].includes(tag)).forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags);
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

