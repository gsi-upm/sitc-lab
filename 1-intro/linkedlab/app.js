(() => {
  const model = window.LinkedLabModel;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const state = {
    lang: 'es',
    step: 0,
    transformed: false,
    selectedNode: null,
    activeEdges: [],
    selectedTriple: 'city',
    fullUris: false,
    tripleCorrect: false,
    uriChoice: null,
    queryIndex: 0,
    queryRan: false,
    external: false,
    classification: null,
    challengeModel: null,
    challengeQuery: null,
    completed: false
  };

  const copy = () => model.copy[state.lang];
  const text = value => typeof value === 'string' ? value : value[state.lang];
  const escapeHtml = value => String(value).replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]);
  const nodeById = id => model.nodes.find(node => node.id === id);
  const edgeById = id => model.edges.find(edge => edge.id === id);
  const extractedEdges = () => model.edges.filter(edge => edge.extracted);
  const activeNodeIds = edges => new Set(edges.flatMap(id => {
    const edge = edgeById(id);
    return edge ? [edge.source, edge.target] : [];
  }));

  function typeLabel(node) {
    const labels = {
      es: { organization: 'organización', university: 'universidad', city: 'ciudad', country: 'país', class: 'clase', year: 'año', continent: 'continente' },
      en: { organization: 'organisation', university: 'university', city: 'city', country: 'country', class: 'class', year: 'year', continent: 'continent' }
    };
    return labels[state.lang][node.type] || node.type;
  }

  function expandTerm(term) {
    if (term.startsWith('"')) return term;
    const split = term.indexOf(':');
    if (split < 1) return term;
    const prefix = term.slice(0, split);
    const local = term.slice(split + 1);
    return model.prefixes[prefix] ? `<${model.prefixes[prefix]}${local}>` : term;
  }

  function term(termValue) {
    return state.fullUris ? expandTerm(termValue) : termValue;
  }

  function tripleForEdge(edge) {
    return [nodeById(edge.source).uri, edge.predicate, nodeById(edge.target).uri];
  }

  function graphSVG(options = {}) {
    const includeExternal = Boolean(options.external);
    const showUris = Boolean(options.showUris);
    const activeEdges = options.activeEdges || [];
    const activeNode = options.activeNode || null;
    const edges = model.edges.filter(edge => edge.extracted || (includeExternal && edge.external));
    const nodes = model.nodes.filter(node => node.kind !== 'external' || includeExternal);
    const activeNodes = activeNodeIds(activeEdges);

    const edgeMarkup = edges.map(edge => {
      const source = nodeById(edge.source);
      const target = nodeById(edge.target);
      const active = activeEdges.includes(edge.id);
      const dim = activeEdges.length > 0 && !active;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.hypot(dx, dy) || 1;
      const x1 = source.x + (dx / distance) * 50;
      const y1 = source.y + (dy / distance) * 50;
      const x2 = target.x - (dx / distance) * 54;
      const y2 = target.y - (dy / distance) * 54;
      let labelX = (source.x + target.x) / 2;
      let labelY = (source.y + target.y) / 2 - 10;
      if (Math.abs(source.x - target.x) < 30) labelX += 62;
      return `
        <g data-edge-group="${edge.id}">
          <line class="edge-line${edge.external ? ' external' : ''}${active ? ' active' : ''}${dim ? ' dim' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>
          <text class="edge-label${edge.external ? ' external' : ''}${active ? ' active' : ''}${dim ? ' dim' : ''}" x="${labelX}" y="${labelY}">${escapeHtml(showUris ? edge.predicate : text(edge.label))}</text>
        </g>`;
    }).join('');

    const nodeMarkup = nodes.map(node => {
      const active = node.id === activeNode || activeNodes.has(node.id);
      const dim = activeEdges.length > 0 && !active;
      const kind = node.kind === 'literal' ? 'literal' : node.kind === 'external' ? 'external' : 'resource';
      const shape = node.kind === 'literal'
        ? `<rect x="${node.x - 54}" y="${node.y - 32}" width="108" height="64" rx="13"></rect>`
        : `<circle cx="${node.x}" cy="${node.y}" r="46"></circle>`;
      const mainLabel = showUris ? node.uri : text(node.label);
      const wrapped = mainLabel.length > 23 ? `${mainLabel.slice(0, 22)}…` : mainLabel;
      return `
        <g class="node ${kind}${active ? ' active' : ''}${dim ? ' dim' : ''}" data-node="${node.id}" tabindex="0" role="button" aria-label="${escapeHtml(text(node.label))}">
          <title>${escapeHtml(node.uri)}</title>
          ${shape}
          <text x="${node.x}" y="${node.y + 3}">${escapeHtml(wrapped)}</text>
          <text class="node-type" x="${node.x}" y="${node.y + 20}">${escapeHtml(typeLabel(node))}</text>
        </g>`;
    }).join('');

    return `
      <svg class="knowledge-graph" viewBox="0 0 930 470" role="img" aria-label="${escapeHtml(copy().graphLabel)}">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#c62977"></path></marker>
          <marker id="arrow-grey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#9da9b4"></path></marker>
        </defs>
        ${edgeMarkup}${nodeMarkup}
      </svg>`;
  }

  function legend(includeExternal = false) {
    const c = copy();
    return `<div class="legend">
      <span><i class="resource"></i>${c.legendResource}</span>
      <span><i class="property"></i>${c.legendProperty}</span>
      <span><i class="literal"></i>${c.legendLiteral}</span>
      ${includeExternal ? `<span><i class="external"></i>${c.legendExternal}</span>` : ''}
    </div>`;
  }

  function taggedText() {
    if (state.lang === 'es') {
      return `El <span class="tag resource" data-tag-node="gsi">Grupo de Sistemas Inteligentes (GSI)</span> <span class="tag property" data-tag-edge="partOf">pertenece a</span> la <span class="tag resource" data-tag-node="upm">Universidad Politécnica de Madrid (UPM)</span>. La <span class="tag resource" data-tag-node="upm">UPM</span> <span class="tag property" data-tag-edge="city">está en</span> <span class="tag resource" data-tag-node="madrid">Madrid</span> y <span class="tag property" data-tag-edge="founded">fue fundada en</span> <span class="tag literal" data-tag-node="1971">1971</span>. <span class="tag resource" data-tag-node="madrid">Madrid</span> <span class="tag property" data-tag-edge="country">está en</span> <span class="tag resource" data-tag-node="spain">España</span>.`;
    }
    return `The <span class="tag resource" data-tag-node="gsi">Intelligent Systems Group (GSI)</span> <span class="tag property" data-tag-edge="partOf">belongs to</span> the <span class="tag resource" data-tag-node="upm">Technical University of Madrid (UPM)</span>. <span class="tag resource" data-tag-node="upm">UPM</span> <span class="tag property" data-tag-edge="city">is in</span> <span class="tag resource" data-tag-node="madrid">Madrid</span> and <span class="tag property" data-tag-edge="founded">was founded in</span> <span class="tag literal" data-tag-node="1971">1971</span>. <span class="tag resource" data-tag-node="madrid">Madrid</span> <span class="tag property" data-tag-edge="country">is in</span> <span class="tag resource" data-tag-node="spain">Spain</span>.`;
  }

  function guide(step, definition, callout = '') {
    const c = copy();
    return `<aside class="guide">
      <p class="step-kicker">${escapeHtml(c.stepCount(step + 1))}</p>
      <h2>${escapeHtml(c.steps[step])}</h2>
      <p>${definition}</p>
      ${callout ? `<div class="guide-callout">${callout}</div>` : ''}
    </aside>`;
  }

  function renderExtraction() {
    const c = copy();
    const graph = state.transformed
      ? `<div class="graph-wrap">${graphSVG({ activeEdges: state.activeEdges, activeNode: state.selectedNode })}<span class="graph-caption">${c.graphLabel}</span></div>`
      : `<div class="graph-wrap empty"><div><strong>${c.emptyGraph}</strong><span>${c.emptyGraphHint}</span></div></div>`;
    return `<div class="stage">
      ${guide(0, c.extractionIntro, c.extractionNote)}
      <div class="workspace">
        <div class="split-demo">
          <section class="text-panel">
            <div class="panel-title"><span>${c.textLabel}</span></div>
            <div class="source-text">${state.transformed ? taggedText() : escapeHtml(c.sourceText)}</div>
            ${state.transformed ? legend() : ''}
            <div class="button-row" style="margin-top:15px">
              <button class="primary" id="transform" type="button">${c.transform}</button>
              <button class="secondary" id="reset-extraction" type="button" ${state.transformed ? '' : 'disabled'}>${c.reset}</button>
            </div>
          </section>
          <section class="graph-panel">
            <div class="panel-title"><span>${c.graphLabel}</span></div>
            ${graph}
          </section>
        </div>
      </div>
    </div>`;
  }

  function inspector() {
    const c = copy();
    if (!state.selectedNode) return `<div class="inspector"><p>${c.inspectorEmpty}</p></div>`;
    const node = nodeById(state.selectedNode);
    const connected = model.edges.filter(edge => edge.extracted && (edge.source === node.id || edge.target === node.id));
    const kind = node.kind === 'literal' ? c.literal : node.kind === 'external' ? c.external : node.type === 'class' ? c.classLabel : c.resource;
    return `<div class="inspector">
      <h4>${escapeHtml(text(node.label))}</h4>
      <p>${escapeHtml(kind)} · ${escapeHtml(typeLabel(node))}</p>
      <dl>
        <dt>${c.identifier}</dt><dd><code>${escapeHtml(node.uri)}</code></dd>
        <dt>${c.connections}</dt><dd>${connected.map(edge => escapeHtml(text(edge.label))).join(', ') || '—'}</dd>
      </dl>
    </div>`;
  }

  function renderGraphMeaning() {
    const c = copy();
    const feedback = state.classification === null ? '' : state.classification === 'literal' ? c.correctLiteral : c.tryAgain;
    return `<div class="stage">
      ${guide(1, c.graphDefinition, c.graphTaskHint)}
      <div class="workspace">
        <div class="workspace-head"><div><h3>${c.graphTask}</h3><p>${c.graphTaskHint}</p></div></div>
        <div class="graph-wrap">${graphSVG({ activeEdges: state.activeEdges, activeNode: state.selectedNode })}</div>
        ${legend()}
        ${inspector()}
        <div class="quiz">
          <h4>${c.classifyQuestion}</h4>
          <div class="option-list">
            <button class="option ${state.classification === 'resource' ? 'wrong' : ''}" data-classify="resource">${c.classifyResource}</button>
            <button class="option ${state.classification === 'literal' ? 'correct' : ''}" data-classify="literal">${c.classifyLiteral}</button>
            <button class="option ${state.classification === 'property' ? 'wrong' : ''}" data-classify="property">${c.classifyClass}</button>
          </div>
          <p class="feedback ${state.classification === null ? '' : state.classification === 'literal' ? 'good' : 'bad'}">${feedback}</p>
        </div>
      </div>
    </div>`;
  }

  function turtleLines() {
    const prefixLines = state.fullUris ? [] : [
      '@prefix ex: <https://example.org/> .',
      '@prefix dbo: <http://dbpedia.org/ontology/> .',
      '@prefix dbr: <http://dbpedia.org/resource/> .',
      '@prefix schema: <https://schema.org/> .',
      '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
      '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
      ''
    ];
    const tripleLines = extractedEdges().map(edge => ({ id: edge.id, value: tripleForEdge(edge).map(term).join(' ') + ' .' }));
    return { prefixLines, tripleLines };
  }

  function renderRdf() {
    const c = copy();
    const rows = extractedEdges().map(edge => {
      const triple = tripleForEdge(edge).map(term);
      return `<tr data-triple="${edge.id}" class="${state.selectedTriple === edge.id ? 'active' : ''}"><td><code>${escapeHtml(triple[0])}</code></td><td><code>${escapeHtml(triple[1])}</code></td><td><code>${escapeHtml(triple[2])}</code></td></tr>`;
    }).join('');
    const turtle = turtleLines();
    const code = [
      ...turtle.prefixLines.map(line => `<span class="code-line">${escapeHtml(line)}</span>`),
      ...turtle.tripleLines.map(line => `<span class="code-line ${state.selectedTriple === line.id ? 'active' : ''}" data-code-edge="${line.id}">${escapeHtml(line.value)}</span>`)
    ].join('');
    const tripleFeedback = state.tripleCorrect === null || state.tripleCorrect === false ? '' : c.correctTriple;
    return `<div class="stage">
      ${guide(2, c.rdfDefinition, `<strong>${c.modellingTask}</strong><br>${c.modellingSentence}<div class="triple-builder">
        <label>${c.subject}<select id="builder-subject"><option value="">${c.choose}</option><option value="ex:upm">ex:upm</option><option value="dbo:foundingYear">dbo:foundingYear</option><option value="1971">1971</option></select></label>
        <label>${c.predicate}<select id="builder-predicate"><option value="">${c.choose}</option><option value="dbo:foundingYear">dbo:foundingYear</option><option value="ex:upm">ex:upm</option><option value="1971">1971</option></select></label>
        <label>${c.object}<select id="builder-object"><option value="">${c.choose}</option><option value="yearLiteral">&quot;1971&quot;^^xsd:gYear</option><option value="ex:upm">ex:upm</option><option value="dbo:foundingYear">dbo:foundingYear</option></select></label>
      </div><button class="secondary" id="check-triple">${c.check}</button><p class="feedback ${state.tripleCorrect ? 'good' : 'bad'}" id="triple-feedback">${tripleFeedback}</p>`)}
      <div class="workspace">
        <div class="graph-wrap rdf-graph">${graphSVG({ activeEdges: [state.selectedTriple] })}</div>
        <p class="select-triple">${c.selectTriple}</p>
        <div class="rdf-grid">
          <section class="panel">
            <div class="panel-title"><span>${c.triplesTitle}</span></div>
            <table class="triple-table"><thead><tr><th>${c.subject}</th><th>${c.predicate}</th><th>${c.object}</th></tr></thead><tbody>${rows}</tbody></table>
          </section>
          <section class="panel">
            <div class="panel-title"><span>${c.turtleTitle}</span><span class="segmented"><button data-uri-mode="compact" class="${state.fullUris ? '' : 'active'}">${c.compact}</button><button data-uri-mode="full" class="${state.fullUris ? 'active' : ''}">${c.full}</button></span></div>
            <pre class="code-card">${code}</pre>
          </section>
        </div>
      </div>
    </div>`;
  }

  function renderUris() {
    const c = copy();
    const choices = [
      ['good', c.uriGood], ['local', c.uriBadLocal], ['literal', c.uriBadLiteral]
    ].map(([id, label]) => `<button class="option code-option ${state.uriChoice === id ? id === 'good' ? 'correct' : 'wrong' : ''}" data-uri-choice="${id}">${escapeHtml(label)}</button>`).join('');
    let feedback = '';
    if (state.uriChoice === 'good') feedback = c.uriGoodNote;
    if (state.uriChoice === 'local') feedback = c.uriLocalNote;
    if (state.uriChoice === 'literal') feedback = c.uriLiteralNote;
    const prefixes = Object.entries(model.prefixes).map(([prefix, uri]) => `<div class="prefix"><b>${prefix}:</b><span>${escapeHtml(uri)}</span></div>`).join('');
    return `<div class="stage">
      ${guide(3, c.uriDefinition)}
      <div class="workspace">
        <div class="identity-flow">
          <article class="identity-card"><small>${c.labelHuman}</small><strong>Madrid</strong><code>${c.labelAmbiguity}</code></article>
          <article class="identity-card"><small>${c.uriMachine}</small><strong>dbr:Madrid</strong><code>http://dbpedia.org/resource/Madrid</code></article>
          <article class="identity-card"><small>${c.vocabulary}</small><strong>dbo:city</strong><code>http://dbpedia.org/ontology/city</code></article>
        </div>
        <section class="panel">
          <div class="panel-title"><span>${c.prefixTitle}</span></div>
          <div class="prefix-grid">${prefixes}</div>
        </section>
        <div class="quiz">
          <h4>${c.uriTask}</h4>
          <div class="option-list">${choices}</div>
          <p class="feedback ${state.uriChoice ? state.uriChoice === 'good' ? 'good' : 'bad' : ''}">${feedback}</p>
        </div>
      </div>
    </div>`;
  }

  function renderSparql() {
    const c = copy();
    const query = model.queries[state.queryIndex];
    const selectors = model.queries.map((item, index) => `<button data-query="${index}" class="${state.queryIndex === index ? 'active' : ''}">${escapeHtml(text(item.question))}</button>`).join('');
    const code = escapeHtml(query.code).replace(/\?(\w+)/g, '<span class="variable">?$1</span>');
    const resultTable = state.queryRan ? `<table class="results"><thead><tr>${query.columns.map(column => `<th>?${column}</th>`).join('')}</tr></thead><tbody>${query.rows.map(row => `<tr>${row.map(value => `<td><code>${escapeHtml(value)}</code></td>`).join('')}</tr>`).join('')}</tbody></table>` : '';
    return `<div class="stage">
      ${guide(4, c.sparqlDefinition)}
      <div class="workspace">
        <div class="panel-title"><span>${c.question}</span></div>
        <div class="query-selector">${selectors}</div>
        <div class="sparql-grid">
          <section class="panel">
            <div class="panel-title"><span>${c.query}</span></div>
            <pre class="code-card query-code">${code}</pre>
            <div class="button-row" style="margin-top:12px"><button class="primary" id="run-query">${c.runQuery}</button></div>
            <p class="matching-note">${state.queryRan ? c.matchDone : c.matchIdle}</p>
            ${state.queryRan ? `<h4>${c.result}</h4>${resultTable}` : ''}
          </section>
          <section class="graph-panel">
            <div class="panel-title"><span>${c.graphLabel}</span></div>
            <div class="graph-wrap">${graphSVG({ activeEdges: state.queryRan ? query.edges : [] })}</div>
          </section>
        </div>
      </div>
    </div>`;
  }

  function renderLinked() {
    const c = copy();
    return `<div class="stage">
      ${guide(5, c.linkedDefinition, c.linkedNote)}
      <div class="workspace">
        <div class="workspace-head"><div><h3>${c.graphLabel}</h3><p>${state.external ? c.externalFacts : c.extractedFacts}</p></div><button class="primary" id="toggle-external">${state.external ? c.removeLinks : c.enrich}</button></div>
        <div class="graph-wrap">${graphSVG({ external: state.external })}</div>
        ${legend(true)}
        <div class="linked-stats"><span class="stat">${c.extractedFacts}: 5</span><span class="stat">${c.externalFacts}: ${state.external ? 2 : 0}</span></div>
        <section class="panel">
          <div class="panel-title"><span>${c.principlesTitle}</span></div>
          <div class="principles">${c.principles.map((principle, index) => `<div class="principle"><b>${index + 1}</b><span>${escapeHtml(principle)}</span></div>`).join('')}</div>
        </section>
      </div>
    </div>`;
  }

  function miniGraph(type) {
    if (type === 'a') return `<div class="mini-graph"><span class="mini-node">OEG</span><i class="mini-edge"></i><span class="mini-node">UPM</span><i class="mini-edge"></i><span class="mini-node">Madrid</span></div>`;
    if (type === 'b') return `<div class="mini-graph"><span class="mini-node">OEG</span><i class="mini-edge"></i><span class="mini-node">Madrid</span></div>`;
    return `<div class="mini-graph"><span class="mini-node">“OEG pertenece a UPM…”</span></div>`;
  }

  function renderChallenge() {
    const c = copy();
    const modelFeedback = state.challengeModel === null ? '' : state.challengeModel === 'a' ? c.modelCorrect : c.modelWrong;
    const queries = [
      'SELECT ?city WHERE {\n  ex:oeg schema:parentOrganization ?university .\n  ?university dbo:city ?city .\n}',
      'SELECT ?city WHERE {\n  ?city schema:parentOrganization ex:oeg .\n}',
      'SELECT ?city WHERE {\n  ex:oeg ?city "UPM" .\n}'
    ];
    const queryButtons = state.challengeModel === 'a' ? `<div class="challenge-queries">${queries.map((query, index) => `<button data-challenge-query="${index}" class="${state.challengeQuery === index ? index === 0 ? 'correct' : 'wrong' : ''}">${escapeHtml(query)}</button>`).join('')}</div>` : '';
    const conclusions = c.conclusions.map(([title, description]) => `<article class="conclusion"><h4>${escapeHtml(title)}</h4><p>${escapeHtml(description)}</p></article>`).join('');
    return `<div class="stage">
      ${guide(6, c.challengeText)}
      <div class="workspace">
        <h3>${c.challengeTitle}</h3>
        <div class="challenge-models">
          <button class="model-choice ${state.challengeModel === 'a' ? 'correct' : ''}" data-model="a">${miniGraph('a')}<strong>${c.modelA}</strong></button>
          <button class="model-choice ${state.challengeModel === 'b' ? 'wrong' : ''}" data-model="b">${miniGraph('b')}<strong>${c.modelB}</strong></button>
          <button class="model-choice ${state.challengeModel === 'c' ? 'wrong' : ''}" data-model="c">${miniGraph('c')}<strong>${c.modelC}</strong></button>
        </div>
        <p class="feedback ${state.challengeModel ? state.challengeModel === 'a' ? 'good' : 'bad' : ''}">${modelFeedback}</p>
        ${state.challengeModel === 'a' ? `<div class="quiz"><h4>${c.challengeQuery}</h4>${queryButtons}<p class="feedback ${state.challengeQuery === null ? '' : state.challengeQuery === 0 ? 'good' : 'bad'}">${state.challengeQuery === 0 ? c.challengeSuccess : state.challengeQuery === null ? '' : c.tryAgain}</p></div>` : ''}
        <h3 style="margin-top:22px">${c.conclusionsTitle}</h3>
        <div class="conclusions">${conclusions}</div>
      </div>
    </div>`;
  }

  function renderContent() {
    const renderers = [renderExtraction, renderGraphMeaning, renderRdf, renderUris, renderSparql, renderLinked, renderChallenge];
    $('#content').innerHTML = renderers[state.step]();
    bindStepEvents();
  }

  function setNodeSelection(id) {
    state.selectedNode = id;
    state.activeEdges = extractedEdges().filter(edge => edge.source === id || edge.target === id).map(edge => edge.id);
    renderContent();
  }

  function bindGraphEvents() {
    $$('.node[data-node]').forEach(node => {
      const select = () => setNodeSelection(node.dataset.node);
      node.addEventListener('click', select);
      node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); } });
    });
  }

  function bindStepEvents() {
    bindGraphEvents();
    $('#transform')?.addEventListener('click', () => { state.transformed = true; state.activeEdges = []; state.selectedNode = null; renderContent(); });
    $('#reset-extraction')?.addEventListener('click', () => { state.transformed = false; state.activeEdges = []; state.selectedNode = null; renderContent(); });
    $$('[data-tag-node]').forEach(tag => tag.addEventListener('click', () => setNodeSelection(tag.dataset.tagNode)));
    $$('[data-tag-edge]').forEach(tag => tag.addEventListener('click', () => { state.activeEdges = [tag.dataset.tagEdge]; state.selectedNode = null; renderContent(); }));
    $$('[data-classify]').forEach(button => button.addEventListener('click', () => { state.classification = button.dataset.classify; renderContent(); }));
    $$('[data-triple]').forEach(row => row.addEventListener('click', () => { state.selectedTriple = row.dataset.triple; renderContent(); }));
    $$('[data-uri-mode]').forEach(button => button.addEventListener('click', () => { state.fullUris = button.dataset.uriMode === 'full'; renderContent(); }));
    $('#check-triple')?.addEventListener('click', () => {
      const correct = $('#builder-subject').value === 'ex:upm' && $('#builder-predicate').value === 'dbo:foundingYear' && $('#builder-object').value === 'yearLiteral';
      state.tripleCorrect = correct;
      const feedback = $('#triple-feedback');
      feedback.textContent = correct ? copy().correctTriple : copy().wrongTriple;
      feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
    });
    $$('[data-uri-choice]').forEach(button => button.addEventListener('click', () => { state.uriChoice = button.dataset.uriChoice; renderContent(); }));
    $$('[data-query]').forEach(button => button.addEventListener('click', () => { state.queryIndex = Number(button.dataset.query); state.queryRan = false; renderContent(); }));
    $('#run-query')?.addEventListener('click', () => { state.queryRan = true; renderContent(); });
    $('#toggle-external')?.addEventListener('click', () => { state.external = !state.external; renderContent(); });
    $$('[data-model]').forEach(button => button.addEventListener('click', () => { state.challengeModel = button.dataset.model; state.challengeQuery = null; render(); }));
    $$('[data-challenge-query]').forEach(button => button.addEventListener('click', () => { state.challengeQuery = Number(button.dataset.challengeQuery); state.completed = false; render(); }));
  }

  function renderTabs() {
    const c = copy();
    $('#tabs').innerHTML = c.steps.map((label, index) => `<button type="button" data-step="${index}" class="${state.step === index ? 'active' : ''}" ${state.step === index ? 'aria-current="step"' : ''}>${index + 1}. ${escapeHtml(label)}</button>`).join('');
    $$('#tabs [data-step]').forEach(button => button.addEventListener('click', () => { state.step = Number(button.dataset.step); state.activeEdges = []; state.selectedNode = null; render(); window.scrollTo({ top: $('#tabs').offsetTop - 10, behavior: 'smooth' }); }));
  }

  function renderNavigation() {
    const c = copy();
    const previous = $('#previous');
    const next = $('#next');
    previous.textContent = c.previous;
    previous.disabled = state.step === 0;
    next.textContent = state.step === 6 ? c.finish : c.next;
    next.disabled = state.step === 6 && (state.challengeQuery !== 0 || state.completed);
    $('#step-count').textContent = c.stepCount(state.step + 1);
  }

  function render() {
    const c = copy();
    document.documentElement.lang = state.lang;
    document.title = `LinkedLab · ${state.lang === 'es' ? 'SITC Lab' : 'SITC Lab'}`;
    $('#title').textContent = c.title;
    $('#intro').textContent = c.intro;
    $('#learning-path').innerHTML = c.path.map((label, index) => `<span class="path-item ${index === state.step ? 'active' : ''}">${escapeHtml(label)}</span>`).join('');
    renderTabs();
    renderContent();
    renderNavigation();
    $('#status').textContent = state.completed ? c.completed : '';
  }

  $('#language').addEventListener('change', event => { state.lang = event.target.value; render(); });
  $('#previous').addEventListener('click', () => { if (state.step > 0) { state.step -= 1; state.activeEdges = []; state.selectedNode = null; render(); } });
  $('#next').addEventListener('click', () => {
    if (state.step < 6) { state.step += 1; state.activeEdges = []; state.selectedNode = null; render(); window.scrollTo({ top: $('#tabs').offsetTop - 10, behavior: 'smooth' }); }
    else if (state.challengeQuery === 0) { state.completed = true; render(); }
  });

  render();
})();
