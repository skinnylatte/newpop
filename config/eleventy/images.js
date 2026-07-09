const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

function registerImages(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["avif", "webp", "jpeg"],
    widths: [400, 800, 1200, 1600],
    urlPath: "/img/opt/",
    outputDir: "./_site/img/opt/",
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
      sizes: "(min-width: 70rem) 700px, 100vw",
    },
    failOnError: false,
  });
}

module.exports = {
  registerImages,
};
