---
layout: default
title: "EnigmaXplore 3.0"
date: 2025-10-10
tags: ["web", "ssti"]
ctf_url: "https://enigmaxplore.ctfd.io/"
team: "__stack_chk_fail"
---

{% assign writeups = site.writeups | where: "parent", page.title %}

<h1>{{ page.title }} Writeups</h1>
<div class="writeups">
{% for writeup in writeups %}
    <div class="writeup">
        <a href="{{ writeup.url }}">{{ writeup.title | downcase }}</a>
        {% for tag in writeup.tags %}
            <p class="category-tag">{{ tag }}</p>
        {% endfor %}
    </div>
{% endfor %}
</div>

