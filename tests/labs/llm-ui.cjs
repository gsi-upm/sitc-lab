const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const url = process.env.LLM_URL || 'http://127.0.0.1:4180/1-intro/llmlab/';

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
    args: ['--no-sandbox']
  });
  try {
    for (const width of [1440, 390, 360]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      await page.locator('[data-step="0"]').waitFor();

      for (const lang of ['es', 'en']) {
        await page.selectOption('#language', lang);
        assert.equal(await page.locator('.tabs button').count(), 7);

        await page.click('[data-step="0"]');
        assert.equal(await page.locator('.embedding-row').count(), 4);
        assert.ok((await page.locator('.embedding-header').textContent()).includes(lang === 'es' ? 'embedding' : 'Lexical'));
        await page.click('[data-vector-token="3"]');
        assert.ok((await page.locator('.selected-vector-detail').textContent()).includes('bank'));

        await page.click('[data-step="1"]');
        assert.ok(await page.locator('.bank-word').count() >= 4);

        await page.click('[data-step="2"]');
        const stableSlider = await page.evaluate(() => {
          const slider = document.querySelector('#move');
          slider.value = '62';
          slider.dispatchEvent(new Event('input', { bubbles: true }));
          return slider === document.querySelector('#move') &&
            document.querySelector('.move-control output').value === '62%';
        });
        assert.equal(stableSlider, true);
        await page.locator('#move').fill('100');
        assert.equal(await page.locator('#move').inputValue(), '100');
        assert.equal(await page.locator('.move-control output').textContent(), '100%');
        assert.equal(await page.locator('.context-bank').count(), 1);
        await page.click('[data-context="1"]');
        assert.equal(await page.locator('#move').inputValue(), '100');
        assert.ok((await page.locator('.source-sentence').textContent()).includes('Money'));
        assert.ok((await page.locator('.direction-note').textContent()).includes('money'));

        await page.click('[data-step="3"]');
        await page.click('[data-concept="k"]');
        await page.click('[data-context="1"]');
        const rows = await page.locator('.attention-row').allTextContents();
        assert.ok(rows[0].toLowerCase().includes('money'));
        await page.click('[data-concept="v"]');
        assert.equal(await page.locator('.value-mix.active').count(), 1);
        assert.equal(await page.locator('.value-term').count(), 4);
        assert.equal(await page.locator('.qkv-analogy').count(), 1);
        assert.ok((await page.locator('.training-note').textContent()).includes('WQ'));
        assert.ok((await page.locator('.training-note').textContent()).includes('WV'));

        await page.click('[data-step="4"]');
        assert.equal(await page.locator('.head-card').count(), 3);
        assert.equal(await page.locator('.head-definition').count(), 1);
        assert.equal(await page.locator('.heads-caveat').count(), 1);
        assert.equal(await page.locator('.head-projections').count(), 7);
        assert.equal(await page.locator('.head-learning').count(), 1);
        await page.click('[data-head="0"]');
        const firstHead = await page.locator('.selected-head h3').textContent();
        await page.click('[data-head="2"]');
        const thirdHead = await page.locator('.selected-head h3').textContent();
        assert.notEqual(firstHead, thirdHead);
        assert.equal(await page.locator('.head-card.active').count(), 1);
        assert.equal(await page.locator('.concat-piece.active').count(), 1);
        assert.equal(await page.locator('.selected-head .attention-row').count(), 4);

        await page.click('[data-step="5"]');
        assert.equal(await page.locator('.stage-example').getAttribute('data-example-stage'), '0');
        assert.equal(await page.locator('.demo-unit').count(), 3);
        await page.click('#advance-pipe');
        assert.equal(await page.locator('.vector-card').count(), 3);
        await page.click('#advance-pipe');
        await page.click('#advance-pipe');
        assert.equal(await page.locator('.mlp-vector').count(), 3);
        await page.click('#advance-pipe');
        assert.equal(await page.locator('.stage-example').getAttribute('data-example-stage'), '4');
        assert.equal(await page.locator('.score-row').count(), 4);
        assert.equal(await page.locator('.prob-row').count(), 4);
        assert.ok((await page.locator('.demo-prediction').textContent()).includes('bank'));
        await page.click('#next');
        assert.equal(await page.locator('.final-challenge').count(), 1);
        assert.equal(await page.locator('#next').isEnabled(), false);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }

      assert.deepEqual(errors, []);
      await page.screenshot({ path: `/tmp/llmlab-${width}.png`, fullPage: true });
      await page.close();
      console.log('LLMLab vectors, context, QKV, heads, MLP, prediction and ES/EN passed', width);
    }
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
