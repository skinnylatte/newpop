module.exports = function (eleventyConfig) {

	// copy src/style.css to _site/style.css
	eleventyConfig.addPassthroughCopy("src/style.css");

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