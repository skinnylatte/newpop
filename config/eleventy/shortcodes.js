function registerShortcodes(eleventyConfig, { escapeHtml }) {
  eleventyConfig.addShortcode("youtube", function (videoId, title = "YouTube video") {
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
    async function (
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
    async function (
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

  eleventyConfig.addShortcode(
    "googleSlides",
    function (id, width = 960, height = 569, title = "Embedded Google Slides Presentation") {
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
    }
  );
}

module.exports = {
  registerShortcodes,
};
