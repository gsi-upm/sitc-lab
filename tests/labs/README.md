# Browser checks

Serve `1-intro` on port 4180, then run these checks from this directory:

```sh
npm install
npx playwright install chromium
npm test
```

Set `LABS_URL` to test another server and `CHROME_PATH` to use an installed Chrome binary. Reports and screenshots go to `/tmp`.

The interaction checks cover metric invariants, the ROC operating point, the constant-negative baseline, stored comparisons, regression outliers and R², bilingual prompt interpretation, custom prompt preservation, and the SVM reference case. The layout checks load all four labs at 1440, 390 and 360 CSS pixels, switch both languages, and reject JavaScript errors or page overflow. Mobile checks emulate a viewport and touch interaction; they do not replace testing on a physical phone.

## TreeLab

Run `npm run test:tree` with the repository root served on port 4180 (or set `TREE_URL` to its TreeLab URL). The model checks also run independently with `node tree-model.cjs`. TreeLab checks cover numerical invariants, ID3 gains, deterministic datasets, split constraints, both languages, mobile layouts and comparisons.

## EnsembleLab

Run `npm run test:ensemble` with the repository root served on port 4180, or set `ENSEMBLE_URL`. Model checks run independently with `node ensemble-model.cjs`. Browser tests cover ES/EN, responsive layouts, live controls, stacking stages, and snapshot preservation.
