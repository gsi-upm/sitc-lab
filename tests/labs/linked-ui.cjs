const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const url = process.env.LINKED_URL || 'http://127.0.0.1:4180/1-intro/linkedlab/';

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
      assert.equal(await page.locator('.tabs button').count(), 7);

      await page.click('#transform');
      assert.equal(await page.locator('.knowledge-graph .node').count(), 6);
      assert.equal(await page.locator('.knowledge-graph .edge-line').count(), 5);
      await page.click('[data-tag-node="1971"]');
      assert.ok((await page.locator('.inspector').textContent()).includes('Literal'));

      await page.click('[data-step="1"]');
      await page.click('[data-classify="literal"]');
      assert.equal(await page.locator('.option.correct').count(), 1);

      await page.click('[data-step="2"]');
      assert.equal(await page.locator('[data-triple]').count(), 5);
      await page.click('[data-uri-mode="full"]');
      assert.ok((await page.locator('.code-card').textContent()).includes('http://dbpedia.org/ontology/city'));
      await page.selectOption('#builder-subject', 'ex:upm');
      await page.selectOption('#builder-predicate', 'dbo:foundingYear');
      await page.selectOption('#builder-object', 'yearLiteral');
      await page.click('#check-triple');
      assert.equal(await page.locator('#triple-feedback.good').count(), 1);

      await page.click('[data-step="3"]');
      await page.click('[data-uri-choice="good"]');
      assert.equal(await page.locator('[data-uri-choice="good"].correct').count(), 1);

      await page.click('[data-step="4"]');
      await page.click('[data-query="1"]');
      await page.click('#run-query');
      assert.ok((await page.locator('.results').textContent()).includes('dbr:Spain'));
      assert.equal(await page.locator('.edge-line.active').count(), 3);

      await page.click('[data-step="5"]');
      await page.click('#toggle-external');
      assert.equal(await page.locator('.knowledge-graph .node').count(), 8);
      assert.equal(await page.locator('.edge-line.external').count(), 2);

      await page.click('[data-step="6"]');
      assert.equal(await page.locator('#next').isEnabled(), false);
      assert.equal(await page.locator('.beatles-node').count(), 7);
      assert.equal(await page.locator('.beatles-edge').count(), 10);
      for (const [question, answer] of [0, 1, 2, 3].map((question, index) => [question, [0, 1, 2, 1][index]])) {
        await page.click(`[data-beatles-question="${question}"]`);
        await page.click(`[data-beatles-choice="${answer}"]`);
        await page.click('#check-beatles');
        assert.equal(await page.locator('.beatles-answer.revealed').count(), 1);
      }
      assert.equal(await page.locator('.beatles-question-tabs .solved').count(), 4);
      assert.equal(await page.locator('#next').isEnabled(), true);
      await page.click('#next');
      assert.equal(await page.locator('#next').isEnabled(), false);
      assert.ok((await page.locator('#status').textContent()).includes('completado'));

      await page.selectOption('#language', 'en');
      assert.ok((await page.locator('#title').textContent()).includes('knowledge graph'));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.deepEqual(errors, []);
      await page.screenshot({ path: `/tmp/linkedlab-${width}.png`, fullPage: true });
      await page.close();
      console.log('LinkedLab text, graph, RDF, URI, SPARQL, Linked Data and Beatles challenge passed', width);
    }
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
