---
layout: default
title: "JailCTF 2025"
date: 2025-10-3
tags: ["misc", "moon", "pyjail", "rust"]
ctf_url: "https://https://ctf.pyjail.club/"
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

