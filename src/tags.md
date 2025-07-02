---
layout: layout.njk
title: Tags
permalink: /tags/
eleventyExcludeFromCollections: true
---

<h1>All Tags</h1>

<div class="tags-cloud">
{% for tag in collections.tagList %}
<a href="/tags/{{ tag }}/" class="tag-item">{{ tag }}</a>
{% endfor %}
</div>

<p>{{ collections.tagList.length }} tags total</p>