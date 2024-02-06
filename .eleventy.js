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

	["src/favicon.ico", "src/style.css", "src/photos/uploads"].forEach(path => {
		eleventyConfig.addPassthroughCopy(path);
	});
	eleventyConfig.addFilter("postDate", (dateObj) => {
  return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
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

