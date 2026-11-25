const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../../1-intro/linkedlab/model.js'), 'utf8'), context);

const model = context.window.LinkedLabModel;
assert.equal(model.nodes.length, 8);
assert.equal(model.edges.filter(edge => edge.extracted).length, 5);
assert.equal(model.edges.filter(edge => edge.external).length, 2);
assert.equal(model.copy.es.steps.length, 7);
assert.equal(model.copy.en.steps.length, 7);
assert.equal(model.copy.es.tabLabels.length, 7);
assert.equal(model.copy.en.tabLabels.length, 7);
assert.equal(model.queries.length, 3);
assert.deepEqual([...model.queries[1].edges], ['partOf', 'city', 'country']);
assert.ok(model.queries[1].code.includes('?university'));
assert.ok(model.queries[1].code.includes('org:unitOf'));
assert.equal(model.nodes.find(node => node.id === '1971').kind, 'literal');
assert.equal(model.nodes.find(node => node.id === 'madrid').uri, 'dbr:Madrid');
assert.equal(model.beatlesNodes.length, 12);
assert.equal(model.beatlesNodes.filter(node => node.kind === 'instrument').length, 5);
assert.equal(model.beatlesEdges.length, 17);
assert.equal(model.beatlesEdges.filter(edge => edge.kind === 'performedBy').length, 9);
assert.equal(model.beatlesEdges.filter(edge => edge.kind === 'plays').length, 8);
assert.equal(model.beatlesQuestions.length, 4);
assert.deepEqual([...model.beatlesQuestions.map(question => question.correct)], [0, 1, 2, 1]);
assert.ok(model.beatlesQuestions.some(question => question.options.some(option => option.includes('GROUP BY'))));
assert.ok(model.beatlesQuestions.some(question => question.options.some(option => option.includes('HAVING'))));
assert.ok(!model.beatlesQuestions.some(question => question.options.some(option => /REGEX/i.test(option))));
assert.ok(model.copy.es.rdfDefinition.includes('tripla'));
assert.ok(!model.copy.es.rdfDefinition.includes('triple'));

console.log('LinkedLab model, triplas, queries, Beatles challenge and ES/EN copy passed');
