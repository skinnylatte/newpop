const PASSTHROUGH_PATHS = [
  "./src/favicon.ico",
  "./src/favicon.svg",
  "./src/style.css",
  "./src/youtube-lite.css",
  "./src/youtube-lite.js",
  "./src/photos/uploads",
  "./src/img",
  "./src/assets",
];

function registerPassthrough(eleventyConfig) {
  PASSTHROUGH_PATHS.forEach((path) => {
    eleventyConfig.addPassthroughCopy(path);
  });
}

module.exports = {
  registerPassthrough,
};
