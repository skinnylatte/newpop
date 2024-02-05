---
layout: photos.njk
title: photos
---

<h1>Photos</h1>

<p>Pics pics pics.</p>


<ul>
	
{% for post in collections.photos %}  
	<li>
		<a href="{{ post.url }}">{{ post.data.title }}</a>
	</li>
{% endfor %}
</ul>


