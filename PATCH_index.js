/* ──────────────────────────────────────────────────────────────
PATCH PARA index.html
Reemplazá la función filterCat() y renderCategories() existentes
con este bloque completo. También cambiá el href del nav-links
para que “Colección” apunte a tienda.html.
────────────────────────────────────────────────────────────── */

/* ── CATEGORÍAS ── redirige a tienda.html?cat=X */
const CAT_DEFS = [
{ id:‘all’,              label:‘Todos’,            icon:‘⚔’, desc:‘Ver toda la colección’ },
{ id:‘Parrilla & Asado’, label:‘Parrilla & Asado’, icon:‘🔥’, desc:‘Sets para asadores exigentes’ },
{ id:‘Caza & Campo’,     label:‘Caza & Campo’,     icon:‘🌿’, desc:‘Robustez para el trabajo real’ },
{ id:‘Cocina Profesional’,label:‘Cocina’,          icon:‘👨‍🍳’, desc:‘Precisión para la cocina’ },
{ id:‘Tradición Gaucha’, label:‘Tradición Gaucha’, icon:‘🐄’, desc:‘El facón y la identidad criolla’ },
{ id:‘Diseño Exclusivo’,  label:‘Diseño Exclusivo’, icon:‘✨’, desc:‘Piezas únicas de colección’ },
{ id:‘Cocina & Regalo’,   label:‘Regalo’,           icon:‘🎁’, desc:‘Ideales para regalar’ },
];

function renderCategories(products){
const grid = document.getElementById(‘cat-grid’);
if(!grid) return;
const counts = {};
products.filter(p=>p.active!==false).forEach(p=>{
counts[p.category] = (counts[p.category]||0)+1;
});
const cats = CAT_DEFS.filter(cat => cat.id===‘all’ || counts[cat.id]>0);
grid.innerHTML = cats.map(cat => {
const n = cat.id===‘all’
? products.filter(p=>p.active!==false).length
: (counts[cat.id]||0);
return `<a href="tienda.html${cat.id==='all'?'':'?cat='+encodeURIComponent(cat.id)}" class="cat-card rv" style="background:var(--jet2);border:1px solid var(--silver-line);padding:2.5rem 2rem;display:flex;flex-direction:column;justify-content:space-between;min-height:200px;text-decoration:none;"> <div> <div style="font-size:2.5rem;margin-bottom:1rem;">${cat.icon}</div> <div style="font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--silver3);margin-bottom:.5rem;">${cat.desc}</div> <h3 style="font-family:var(--serif);font-size:1.6rem;font-weight:400;font-style:italic;color:var(--cream);line-height:1.1;">${cat.label}</h3> </div> <div style="display:flex;align-items:center;justify-content:space-between;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--silver-line);"> <span style="font-size:8px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--silver);">${n} pieza${n!==1?'s':''}</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--silver3)" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg> </div> </a>`;
}).join(’’);
grid.querySelectorAll(’.rv’).forEach(el=>obs.observe(el));
}

/* ── filterCat: redirige a tienda en lugar de hacer scroll ── */
function filterCat(cat){
window.location.href = ‘tienda.html’ + (cat===‘all’ ? ‘’ : ‘?cat=’ + encodeURIComponent(cat));
}

/*
ADEMÁS — en el nav del index.html, cambiá:
<li><a href="#coleccion">Colección</a></li>
por:
<li><a href="tienda.html">Tienda</a></li>

Y los botones “Catálogo completo” / “Ver todo el catálogo”:
href=“tienda.html”  (en lugar de wa.me o #coleccion)
*/
