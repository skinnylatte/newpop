---
title: The Archives
layout: archives.njk
tags:
  - archives
  - lists
pagination:
  data: collections.postsByYear
  size: 1
  alias: posts
  reverse: true 
permalink: "archives/{% if pagination.pageNumber > 0 %}{{ posts }}/{% endif %}index.html"
eleventyExcludeFromCollections: true
---



