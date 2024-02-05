---
layout: layout.njk
title: til
---

<h1>TIL</h1>

<p>todayilearned todayilearned todayilearned</p>


<ul>
	
{% for post in collections.til %}  
	<li>
		<a href="{{ post.url }}">{{ post.data.title }}</a>
	</li>
{% endfor %}
</ul>


