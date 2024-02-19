---
layout: tags.njk
title: Tags
eleventyExcludeFromCollections: true
---

<ul>
  {% for tag in collections.tagList %}
    <li>{{ tag }}</li>
  {% endfor %}
</ul>