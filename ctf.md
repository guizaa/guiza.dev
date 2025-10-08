---
layout: default
title: "CTF Competitions"
permalink: /ctf/
---

{% assign sorted_ctfs = site.ctfs | sort: 'date' | reverse %}

<div id="ascii-pencils"></div>
<div class="ctf-list">
<h1>CTF Writeups</h1>
{% for ctf in sorted_ctfs %}
  <div class="ctf-item" data-url="{{ ctf.url }}">
    <span>
      <h3>{{ ctf.title }}</h3>
      <a href="{{ ctf.ctf_url }}" target="_blank">{{ ctf.ctf_url }}</a>
    </span>
    <p>
      Team: {{ ctf.team }}<br>
      Position: {{ ctf.position }}/{{ ctf.total_teams }}
    </p>
    <div class="ctf-meta">
      <span class="date">{{ ctf.date | date: "%d %B %Y" }}</span>
    </div>
    <div class="categories">
      {% for tag in ctf.tags %}
        <span class="category-tag">{{ tag }}</span>
      {% endfor %}
    </div>
  </div>
{% endfor %}
</div>

<script src="/ctf.js"></script>