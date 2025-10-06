---
layout: default
title: "CTF Competitions"
permalink: /ctf/
---

{% assign sorted_ctfs = site.ctfs | sort: 'date' | reverse %}

<div class="ctf-list">
<h1>CTF Writeups</h1>
{% for ctf in sorted_ctfs %}
  <div class="ctf-item">
    <h3><a href="{{ ctf.url }}">{{ ctf.title }}</a></h3>
    <h4>Team: {{ ctf.team }}</h4>
    <div class="ctf-meta">
      <span class="date">{{ ctf.date | date: "%B %Y" }}</span>
    </div>
    <div class="categories">
      {% for tag in ctf.tags %}
        <span class="category-tag">{{ tag }}</span>
      {% endfor %}
    </div>
  </div>
{% endfor %}
</div>