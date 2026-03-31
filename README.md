# Decision Matrix Weight Finding Tool

Static GitHub Pages site for building decision matrix weights from pairwise comparisons.

## What it does

1. Enter categories one at a time or paste them in CSV / comma-separated form.
2. The app asks comparison questions in the form `I care about A __ than B?`
3. Each answer updates the two category weights.
4. The final weights are shown directly as raw scores.

## Math

Each category starts at weight `1`.

For a comparison between `A` and `B`, the tool applies one of these factors:

- Much less than: `0.5`
- Less than: `0.75`
- The same as: `1`
- More than: `1.25`
- Much more than: `1.5`

If the user says `A` matters more than `B`, the app updates:

- `A = A * factor`
- `B = B / factor`

This is a ratio-based update rule. It works because every answer directly changes the relative importance between the two categories being compared. Repeated answers compound, so consistent preferences create larger separations, while neutral answers preserve balance.
