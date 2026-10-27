/* Full registry snapshot for layout review. Only three editors are interactive demos. */
const CATALOG_CATEGORIES = [...new Set(CATALOG_DATA.map(t => t.category))].sort((a,b) => a.localeCompare(b));
const CATALOG_DEMOS = {'json-formatter':'json','api-request-builder':'api','color-contrast-checker':'color'};
const catalogParams = new URLSearchParams(location.search);
const catalogState = {
  category: CATALOG_CATEGORIES.includes(catalogParams.get('category')) ? catalogParams.get('category') : 'all',
  query: '', savedOnly: false, saved: new Set(), expanded: new Set(), sort: 'asc', layout: 'auto', detail: null,
};
const categorySymbols = {
  'API & Web Services':'<path d="M4 7h16m-5-5 5 5-5 5M20 17H4m5-5-5 5 5 5"/>',
  'Artificial Intelligence':'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
  'Certificates & Keys':'<rect x="4" y="3" width="13" height="17" rx="2"/><path d="M8 7h5M8 11h3"/><circle cx="17" cy="15" r="4"/><path d="m15 19-1 4 3-2 3 2-1-4"/>',
  'Cryptography':'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
  'Data Converters':'<path d="M4 6h14l-4-4m4 4-4 4M20 18H6l4-4m-4 4 4 4"/>',
  'Diff & Compare':'<path d="M9 4H3v16h6M15 4h6v16h-6M12 3v18M6 8h1m10 0h1M6 12h1m10 4h1"/>',
  'Encoding & Decoding':'<path d="m8 5-6 7 6 7M16 5l6 7-6 7M14 3l-4 18"/>',
  'Formatters':'<path d="M8 3H6v6l-3 3 3 3v6h2M16 3h2v6l3 3-3 3v6h-2"/>',
  'Fun & Games':'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 7h.01M12 12h.01M17 17h.01M17 7h.01M7 17h.01"/>',
  'Generators':'<path d="m13 2-9 12h7l-1 8 10-13h-8Z"/>',
  'Image & Media':'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m3 17 6-6 5 5 3-3 4 4"/>',
  'Network':'<circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="m10 8-4 8m8-8 4 8M8 19h8"/>',
  'Reference':'<path d="M12 5C8 2 5 2 2 3v16c4-1 7 0 10 2 3-2 6-3 10-2V3c-3-1-6-1-10 2Zm0 0v16"/>',
  'Text & Utilities':'<path d="M3 5V3h18v2M12 3v18m-4 0h8"/>',
  'Validators':'<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
};
function categoryIcon(category) { return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${categorySymbols[category] || '<rect x="4" y="4" width="16" height="16" rx="3"/>'}</svg>`; }
function savedIcon(active=false) {return `<svg class="icon" viewBox="0 0 24 24" fill="${active?'currentColor':'none'}" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/></svg>`;}
function catalogMatches(tool) {
  const words=catalogState.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const haystack=[tool.name,tool.description,tool.category,...tool.tags].join(' ').toLowerCase();
  return words.every(w=>haystack.includes(w)) && (!catalogState.savedOnly || catalogState.saved.has(tool.id));
}
function catalogFiltered() { return CATALOG_DATA.filter(t=>catalogMatches(t)&&(catalogState.category==='all'||t.category===catalogState.category)).sort((a,b)=>catalogState.sort==='asc'?a.name.localeCompare(b.name):b.name.localeCompare(a.name)); }
function catalogCategoryLabel() {return catalogState.category==='all'?'All tools':catalogState.category;}
function catalogNav() {
  return `<button class="category-option ${catalogState.category==='all'?'selected':''}" data-category="all" aria-pressed="${catalogState.category==='all'}">${icon('grid')}<span>All categories</span><b>${CATALOG_DATA.filter(catalogMatches).length}</b></button>${CATALOG_CATEGORIES.map(c=>`<button class="category-option ${catalogState.category===c?'selected':''}" data-category="${escapeHTML(c)}" aria-pressed="${catalogState.category===c}">${categoryIcon(c)}<span>${escapeHTML(c)}</span><b>${CATALOG_DATA.filter(t=>t.category===c&&catalogMatches(t)).length}</b></button>`).join('')}`;
}
function catalogCard(tool) {
  const demo=CATALOG_DEMOS[tool.id], saved=catalogState.saved.has(tool.id);
  return `<article class="catalog-card"><button class="catalog-card-open" ${demo?`data-tool="${demo}"`:`data-inspect="${tool.id}"`} aria-label="${demo?'Try':'View details for'} ${escapeHTML(tool.name)}"><span class="catalog-card-icon">${categoryIcon(tool.category)}</span><span class="catalog-card-copy"><strong>${escapeHTML(tool.name)}</strong><span>${escapeHTML(tool.description)}</span></span>${icon('arrow','catalog-card-arrow')}</button><div class="catalog-card-foot"><span class="catalog-tags">${tool.tags.slice(0,2).map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</span>${demo?'<span class="catalog-demo-badge">Live demo</span>':''}<button class="catalog-save ${saved?'saved':''}" data-save="${tool.id}" aria-pressed="${saved}" aria-label="${saved?'Remove':'Save'} ${escapeHTML(tool.name)}${saved?' from saved tools':''}">${savedIcon(saved)}</button></div></article>`;
}
function catalogResults() {
  const filtered=catalogFiltered();
  if(!filtered.length)return `<div class="catalog-empty"><span>${icon('search')}</span><h3>${catalogState.savedOnly&&!catalogState.saved.size?'Your shortcuts start here.':'No tools match these filters.'}</h3><p>${catalogState.savedOnly&&!catalogState.saved.size?'Save a tool with its star to keep it close at hand.':'Try a broader search, or explore another category.'}</p><button class="secondary-button" data-clear-catalog>Show all tools</button></div>`;
  const searching=catalogState.query.trim()||catalogState.savedOnly||catalogState.category!=='all';
  if(searching)return `<div class="catalog-cards">${filtered.map(catalogCard).join('')}</div>`;
  return CATALOG_CATEGORIES.map(c=>{const group=filtered.filter(t=>t.category===c);const expanded=catalogState.expanded.has(c);return `<section class="catalog-group"><div class="catalog-group-title"><h3>${categoryIcon(c)}${escapeHTML(c)}<span>${group.length}</span></h3><button data-category="${escapeHTML(c)}" class="catalog-view-category">View category ${icon('arrow')}</button></div><div class="catalog-cards">${(expanded?group:group.slice(0,3)).map(catalogCard).join('')}</div>${group.length>3?`<button class="catalog-expand" data-expand="${escapeHTML(c)}" aria-expanded="${expanded}">${expanded?'Show fewer':`Show all ${group.length} tools`}${icon('chevron')}</button>`:''}</section>`;}).join('');
}
function catalogDetail() {
  const tool=CATALOG_DATA.find(t=>t.id===catalogState.detail);if(!tool)return '';
  return `<section class="catalog-detail" id="catalog-detail" tabindex="-1" aria-labelledby="catalog-detail-title"><div class="catalog-detail-title">${categoryIcon(tool.category)}<div><span>${escapeHTML(tool.category)}</span><h3 id="catalog-detail-title">${escapeHTML(tool.name)}</h3></div><button class="icon-button" id="close-catalog-detail" aria-label="Close tool details"><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.6"><path d="m6 6 12 12M6 18 18 6"/></svg></button></div><p>${escapeHTML(tool.description)}</p><div class="catalog-detail-tags">${tool.tags.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div><div class="catalog-detail-notice"><strong>Catalog preview</strong><p>This tool is part of your full collection. Its redesigned editor is not implemented in this sample. Try a working JSON or API demo to explore the controls.</p><div><button class="primary-button" data-tool="json">Try JSON demo ${icon('arrow')}</button><button class="secondary-button" data-tool="api">Try API demo</button></div></div></section>`;
}
function catalogMarkup() {
  const filtered=catalogFiltered();const layout=catalogState.layout==='auto'?(state.concept==='signal'?'list':'grid'):catalogState.layout;
  return `<section class="full-catalog" id="home-tools" aria-labelledby="catalog-heading"><div class="catalog-intro"><div><h2 id="catalog-heading" tabindex="-1">Your whole toolkit. One place.</h2><p><strong>${CATALOG_DATA.length} tools</strong> across ${CATALOG_CATEGORIES.length} categories. Find your next shortcut.</p></div><span class="catalog-preview-note">Full catalog · 3 interactive demos</span></div><div class="catalog-searchbar"><label class="catalog-search-label">${icon('search')}<span class="sr-only">Search all tools</span><input id="catalog-search" type="search" value="${escapeHTML(catalogState.query)}" placeholder="Search tools, formats, or tasks…" autocomplete="off"></label><button class="catalog-saved-filter ${catalogState.savedOnly?'active':''}" id="catalog-saved-filter" aria-label="Show saved tools" aria-pressed="${catalogState.savedOnly}">${savedIcon(catalogState.savedOnly)}<span>Saved</span><b id="catalog-saved-count">${catalogState.saved.size}</b></button></div><div class="catalog-body"><aside class="catalog-category-panel"><div class="catalog-category-heading"><h3>Categories</h3><span>${CATALOG_CATEGORIES.length}</span></div><nav class="catalog-category-nav" id="catalog-category-nav" aria-label="Tool categories">${catalogNav()}</nav><label class="catalog-mobile-category" for="catalog-category-select">Browse a category<select id="catalog-category-select"><option value="all">All categories (${CATALOG_DATA.length})</option>${CATALOG_CATEGORIES.map(c=>`<option value="${escapeHTML(c)}" ${catalogState.category===c?'selected':''}>${escapeHTML(c)} (${CATALOG_DATA.filter(t=>t.category===c).length})</option>`).join('')}</select></label><p class="catalog-category-note">Star a tool to build a shortcut list for this preview.</p></aside><div class="catalog-main"><div class="catalog-controls"><div><h3 id="catalog-active-category">${escapeHTML(catalogCategoryLabel())}</h3><p id="catalog-results-count" role="status">${filtered.length} ${filtered.length===1?'tool':'tools'}${catalogState.query?' matching your search':''}</p></div><div class="catalog-view-controls"><label for="catalog-sort" class="sr-only">Sort tools</label><select id="catalog-sort"><option value="asc" ${catalogState.sort==='asc'?'selected':''}>Name A–Z</option><option value="desc" ${catalogState.sort==='desc'?'selected':''}>Name Z–A</option></select><div class="catalog-layout-switch" aria-label="Catalog layout"><button data-catalog-layout="grid" aria-label="Grid layout" aria-pressed="${layout==='grid'}">${icon('grid')}</button><button data-catalog-layout="list" aria-label="List layout" aria-pressed="${layout==='list'}"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1"/></svg></button></div></div></div><div id="catalog-detail-slot">${catalogDetail()}</div><div id="catalog-results" data-layout="${layout}">${catalogResults()}</div><div class="catalog-end"><span>Showing your real catalog. Saved tools stay in this tab.</span><a href="#home-tools">Back to categories ${icon('arrow')}</a></div></div></div></section>`;
}
function refreshCatalog(options={}) {
  if(!$('#catalog-results'))return;
  const active=document.activeElement;const focus=active?.dataset.category?`[data-category="${CSS.escape(active.dataset.category)}"]`:active?.dataset.save?`[data-save="${CSS.escape(active.dataset.save)}"]`:active?.dataset.expand?`[data-expand="${CSS.escape(active.dataset.expand)}"]`:null;
  const filtered=catalogFiltered();$('#catalog-results').innerHTML=catalogResults();$('#catalog-category-nav').innerHTML=catalogNav();$('#catalog-active-category').textContent=catalogCategoryLabel();$('#catalog-results-count').textContent=`${filtered.length} ${filtered.length===1?'tool':'tools'}${catalogState.query?' matching your search':''}`;$('#catalog-saved-count').textContent=catalogState.saved.size;
  $('#catalog-category-select').value=catalogState.category;$('#catalog-saved-filter').setAttribute('aria-pressed',String(catalogState.savedOnly));$('#catalog-saved-filter').classList.toggle('active',catalogState.savedOnly);
  $('#catalog-results').dataset.layout=catalogState.layout==='auto'?(state.concept==='signal'?'list':'grid'):catalogState.layout;
  all('[data-catalog-layout]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.catalogLayout===$('#catalog-results').dataset.layout)));
  if(focus){const next=$(focus)||$('#catalog-saved-filter');next?.focus({preventScroll:true});}
  if(options.toResults){const destination=$('#catalog-active-category');destination.setAttribute('tabindex','-1');destination.focus({preventScroll:true});destination.scrollIntoView({block:'start',behavior:'instant'});}
}
document.addEventListener('input',event=>{if(event.target.id==='catalog-search'){catalogState.query=event.target.value;refreshCatalog();}});
document.addEventListener('change',event=>{if(event.target.id==='catalog-category-select'){catalogState.category=event.target.value;catalogState.detail=null;$('#catalog-detail-slot').innerHTML='';refreshCatalog({toResults:true});}if(event.target.id==='catalog-sort'){catalogState.sort=event.target.value;refreshCatalog();}});
document.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.category){catalogState.category=b.dataset.category;catalogState.detail=null;$('#catalog-detail-slot').innerHTML='';refreshCatalog({toResults:true});}
  if(b.dataset.save){catalogState.saved.has(b.dataset.save)?catalogState.saved.delete(b.dataset.save):catalogState.saved.add(b.dataset.save);refreshCatalog();}
  if(b.id==='catalog-saved-filter'){catalogState.savedOnly=!catalogState.savedOnly;refreshCatalog();}
  if(b.dataset.catalogLayout){catalogState.layout=b.dataset.catalogLayout;refreshCatalog();}
  if(b.hasAttribute('data-clear-catalog')){catalogState.query='';catalogState.category='all';catalogState.savedOnly=false;catalogState.detail=null;$('#catalog-search').value='';$('#catalog-detail-slot').innerHTML='';refreshCatalog();$('#catalog-search').focus({preventScroll:true});}
  if(b.dataset.expand){catalogState.expanded.has(b.dataset.expand)?catalogState.expanded.delete(b.dataset.expand):catalogState.expanded.add(b.dataset.expand);refreshCatalog();}
  if(b.dataset.inspect){catalogState.detail=b.dataset.inspect;$('#catalog-detail-slot').innerHTML=catalogDetail();$('#catalog-detail').focus({preventScroll:true});$('#catalog-detail').scrollIntoView({block:'start',behavior:'instant'});}
  if(b.id==='close-catalog-detail'){const old=catalogState.detail;catalogState.detail=null;$('#catalog-detail-slot').innerHTML='';$(`[data-inspect="${old}"]`)?.focus();}
});
