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
assert.equal(model.queries.length, 3);
assert.deepEqual([...model.queries[1].edges], ['partOf', 'city', 'country']);
assert.ok(model.queries[1].code.includes('?university'));
assert.equal(model.nodes.find(node => node.id === '1971').kind, 'literal');
assert.equal(model.nodes.find(node => node.id === 'madrid').uri, 'dbr:Madrid');

console.log('LinkedLab model, triples, queries and ES/EN copy passed');
