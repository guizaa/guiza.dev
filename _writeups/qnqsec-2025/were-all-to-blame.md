---
layout: writeup
parent: QnQSec 2025
tags: ["rev"]
---
```
In the end, every fracture is of our own making. What we build to protect us, turns to test us. There’s no innocence in creation — only choices, and the weight they leave behind.
```
chall:
![watb1](/files/watb1.png)

## Input args
![watb2](/files/watb2.png)

From the beginning of `main()`, we can see that the executable takes one argument, which is the flag

![watb3](/files/watb3.png)

This tells us the flag is length `0x24 = 36`

## Logic overview

Most of the executable's logic falls within the body of main and can be broken down into _ sections

### 1. Anti-debugging check

![watb4](/files/watb4.png)
![watb5](/files/watb5.png)

First, the executable spawns a thread that calls `sub_12840` in a busy loop. Within `sub_12840`, `/proc/self/status` is opened and checked for it's `TracerPid`. Whenever a process is being traced/debugged, this value is set to the tracing process' PID, otherwise it's 0. If `sub_12840` detects a `TracerPid != 0`, then it exits the program, effectively preventing the executable from running while being debugged. This can be easily patched out by removing the function call to `sub_12840` in `busy_loop`

### 2. State Function Indexing

![watb6](/files/watb6.png)

For each char in the input flag, variable `i` is set to the char's relative index in this data string, which tells us the flag's charset:

![watb7](/files/watb7.png)

### 3. State Functions

![watb8](/files/watb8.png)
<br>
## ...
## ...
<br>
![watb9](/files/watb9.png)

There are 32 state functions that when indexed correctly will return the code for the following state function. For example, starting at 0, if the first char of the input flag is correct, the assembly starting at `FUNC_0[i]` will return `0x1`, the code for the next state function. If `i` is incorrect, the assembly will return `0x22` and exit immediately. Using this logic, we can guess each flag char: for a given char's flag index `x` and charset index `i` it is correct if `FUNC_x[i]` returns `x+1`. We can generalize this with: for each input flag guess, the first `x` chars are correct if `x-1` state functions are executed (`x` correct returns + 1 incorrect return of `0x22` which exits the executable)

### 4. SHA256 Check

The final section of the executable hashes the input flag and compares it to the correct flag's SHA256 hash.
<br>
Since the flag is `0x24` in length and there are only `0x20` of these state functions, we are left with 4 characters to guess, which in reality only is 3 since we know the flag must end in `}`. We can brute force these remaining 3 characters by using the flag's SHA256 hash from the executable: `841e7dcc3a9c6adbb74e8b710a085ee914f9bc641b430d4bc3849ea679bf522d`

### Solution
The solution consists of counting the number of times the program breaks at a state function call, and then brute forcing the final 3 characters.

sol.py:
```python
#!/usr/bin/env python3
import subprocess
import sys
import hashlib
import itertools

def count_breakpoint_hits(expected, flag):
    # Use multiple continue commands to handle multiple breakpoint hits
    cont = ['-ex', 'continue']
    gdb_cmd = [
        'gdb', '-batch', '-q',
        '-ex', 'set pagination off',
        '-ex', f'break *0x55555556243a',
        '-ex', f'run {flag}'
    ]
    
    for _ in range(expected):
        gdb_cmd += cont

    gdb_cmd.append("./chall.patch")

    result = subprocess.run(gdb_cmd, capture_output=True, text=True)

    # Count breakpoint hits
    output = result.stdout + result.stderr
    count = output.count('Breakpoint 1,')
    return count

if __name__ == "__main__":
    expected = 8
    index = 7
    flag = list("QnQSec{aaaaaaaaaaaaaaaaaaaaaaaaaaaa}")
    print(f"template flag {''.join(flag)}")
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}-"

    found = False
    while True:
        for c in charset:
            print(f"{''.join(flag[:index+1])}", end="\r")
            flag[index] = c
            if count_breakpoint_hits(expected, ''.join(flag)) == expected + 1:
                found = True
                print(''.join(flag[:index+1]), end="\r")
                expected += 1
                index += 1
                break
        if not found:
            break
        found = False

    index = 32
    brute_len = len(flag)-index-1
    print(f"Found {index+1}, starting SHA256 brute force {brute_len}")
    sha256 = '841e7dcc3a9c6adbb74e8b710a085ee914f9bc641b430d4bc3849ea679bf522d'
    total_combinations = len(charset) ** brute_len
    tries = 0
    for combo in itertools.product(charset, repeat=brute_len):
        tries += 1

        missing_chars = ''.join(combo)
        test_flag = ''.join(flag[:index]) + missing_chars + '}'
        calculated = hashlib.sha256(test_flag.encode()).hexdigest()

        if tries % 100000 == 0:
            print(f"Tried {tries:,}/{total_combinations:,} combinations... Current: {test_flag}")
        if calculated == sha256:
            print(f"\n🎯 FOUND THE FLAG!")
            print(f"Missing characters: {missing_chars}")
            print(f"Full flag: {test_flag}")
            print(f"SHA256: {sha256}")
            exit()
    print(f"\n❌ No match found after {tries:,} combinations")
```
<br>
<br>
`QnQSec{InCh00singB0thYouLoseB0th--Q}`