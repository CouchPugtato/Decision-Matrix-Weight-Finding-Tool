# Decision Matrix Weight Finding Tool

Tool for building decision matrix weights from pairwise comparisons.

## What it does

1. Enter categories one at a time or paste them in CSV / comma-separated form.
2. The app asks comparison questions in the form "I care about A __ than B?"
3. Each answer updates the two category weights.
4. The final weights are shown once all questions are answered.

## Math

Each category starts at weight `1`.

For a comparison between `A` and `B`, the user picks one of these base factors:

- Much less than: `0.5`
- Less than: `0.75`
- The same as: `1`
- More than: `1.25`
- Much more than: `1.5`

It then dampens that factor it based on how far apart the two weights already are.

```js
gap = abs(log(A / B))
damping = 1 / (1 + gap)
adjustedFactor = baseFactor ^ damping
```
Then it updates the weights:

```js
A = A * adjustedFactor
B = B / adjustedFactor
```

This makes it so that when one category is already much larger than the other, additional comparisons between those two have a smaller effect. That helps prevent weights from blowing up or shrinking too fast while still letting repeated preferences move the results over time.
