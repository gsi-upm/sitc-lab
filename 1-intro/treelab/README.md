# TreeLab

Bilingual (Spanish/English) decision-tree laboratory for SITC/APAU, UPM. Open `index.html` directly or serve the sitc-lab repository with a static HTTP server. No backend, dependencies, account or network calls are required by this lab.

## Teaching sequence

1. **Build a tree:** manually construct categorical ID3 on the 14 Play Tennis examples. Inspect node subsets, entropy and weighted information gain; choose any available attribute or the highest gain. Completed leaves become explicit rules. This is a learning illustration, not a generalization estimate.
2. **Explore partitions:** binary, axis-aligned classification trees on rectangle, diagonal or circle datasets. Adjust maximum depth (1–8), minimum samples per leaf (1–20), Gini/entropy, label noise and seed. Select a node to highlight its region and examples. Maximum depth is measured from root depth zero.
3. **Compare and generalize:** up to four configurations with side-by-side decision regions, training/validation accuracy, actual depth and leaf count. Comparisons remain in memory until reload; changing controls preserves them. Comparisons across different dataset settings display a warning.

## Algorithm details

`model.js` is a small deterministic educational implementation, not a scikit-learn wrapper. Categorical ID3 partitions by observed attribute values and removes the selected attribute from each branch's available list. Numerical trees evaluate midpoints between consecutive distinct feature values, respecting both children's minimum sample counts. A split must reduce weighted impurity strictly. Ties retain the first feature/threshold; tied leaf classes predict class 0 (No). There is no post-pruning, ensemble training, missing-data handling or regression in this version.

Synthetic data: 240 uniformly sampled two-dimensional points, independently flipped labels at the chosen noise rate, deterministically shuffled into 168 training and 72 validation examples. Only training examples determine splits and node statistics. The validation set supports exploration, not an independent final test. Repeated tuning can overfit it.

## Checks

From repository root:

```sh
node tests/labs/tree-model.cjs
# With the repository served on port 4180 and Playwright installed:
node tests/labs/tree-ui.cjs
```

`TREE_URL` overrides the UI test URL; `CHROME_PATH` selects the browser executable. UI checks cover Spanish/English at 1440, 390 and 360 pixels, the completed tennis tree, node selection, stored comparisons and preserving comparisons when the data changes.
