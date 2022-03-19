# Nestem

- [Nestem](#nestem)
  - [Overview](#overview)
  - [Installation](#installation)
  - [Syntax](#syntax)
    - [Syntax Overview](#syntax-overview)
    - [Examples](#examples)
    - [Variables](#variables)
    - [Weights](#weights)

---

## Overview

Nestem is a sequence generator for the visual programming language [Max/MSP](https://cycling74.com/products/max). Using its own syntax, Nestem will compile and generate sequences that can be used for gates, triggers, timing, events, and more.

---

## Installation

Simply clone this repository and run the following command in the root directory:

```console
npm install
```

---

## Syntax

### Syntax Overview

| Syntax | Description |
| ------ | ----------- |
| [      | Indicates new nest |
| ]      | Indicates nest end |
| '      | Open/close a string literal, ignores whitespace separator |
| \s     | Indicates a terminating sequence in a nested object |
| {      | Indicates new weight |
| }      | Indicates weight end |
| $      | Indicates a variable |

---

### Examples

```text
[[1 0 0][1 1 0]]
```

With the above, outcomes are either:

`1 0 0` or `1 1 0`

A simple tree of this structure would appear as follows:

```text
   [[1 0 0][1 0 0]]
           |
          / \
         /   \
        /     \
   1 0 0       1 1 0
```

---

### Variables

Nestem also supports variables. Take, for instance, the following:

```text
[1 [[1 [[1 0][0 0]][1 1]][0 0]] 1 0]
```

This pattern could be rewritten as

```text
$a1 = [1 0];
$a2 = [0 0];
$a = [1 [$a1 $a2]
$b = [1 1]
$c = [0 0]

[1 [$a $b $c] 1 0]
```

With the above, the outcomes are either:

```text
1 1 1 0 1 0
1 1 0 0 1 0
1 1 1 1 0
or
1 0 0 1 0
```

A simple tree of this structure would appear as follows:

```text
                                [1 [1 [1 0][0 0]][1 1][0 0] 1 0]
                                                    |
                    ----------------------------------------------------------------------
                    |                               |                                    |
        [1 [1 [1 0][0 0]] 1 0]                  1 1 1 1 0                            1 0 0 1 0
                    |
                   / \
        1 1 1 0 1 0   1 1 0 0 1 0

```

---

### Weights

Weights are implicitly added to subpatterns:

- `[a]` - 100% chance of pattern `a` happening
- `[a][b]` - 50% chance of either `a` or `b` happening
- `[a][b][c]` - 33% chance of `a`, `b`, or `c` happening
- Given that `$p1 = [a][b][c]`:
  - `[$p1][e]` - 50% chance that either `e` or `$p1` happens, but `$p1` has a subpattern of `[a][b][c]` which each have a 33% chance of happening.

However, one may add custom weights to their pattern, denoted by a pair of curly braces `{}`. Priority of this calculation is done from left to right.

- `[a]{0.5}[b]{0.25}` `a` has a weight of `0.5`, while `b` has a weight of `0.25`.

- `$p1 = [a]{0.1}[b][c]{0.75}` `a` has a weight of `0.1`, `c` has a weight of `0.75`, while `b` defaults to sum of the other weight values divided by the number of items in the pattern.
