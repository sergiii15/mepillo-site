const slug=new URLSearchParams(location.search).get('p');
const p=window.MEPILLO_PRODUCTS.find(x=>x.slug===slug)||window.MEPILLO_PRODUCTS[0];

function escapeHtml(value=''){return String(value).replace(/[&<>\"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[ch]))}
function featureList(items){return items?.length?`<ul class="amazon-feature-list feature-list-large">${items.map(x=>`<li><span class="feature-check">✓</span><span>${escapeHtml(x)}</span></li>`).join('')}</ul>`:`<p class="muted-copy">Añadiremos más características cuando estén disponibles.</p>`}
function specsTable(items){return items?.length?`<div class="spec-table">${items.map(x=>`<div><span>${escapeHtml(x.label||x.name||'Dato')}</span><strong>${escapeHtml(x.value||'')}</strong></div>`).join('')}</div>`:`<p class="muted-copy">Las especificaciones se completarán cuando estén disponibles.</p>`}
function quickFeatures(items){return (items||[]).slice(0,4).map(x=>`<div class="quick-feature"><span>✓</span><strong>${escapeHtml(x)}</strong></div>`).join('')}

async function render(){
  const catalog=await window.MepilloAmazon.getItem(p);
  const title=catalog.title||p.editorial.displayName;
  document.title=`${title} | MePillo`;
  document.getElementById('productPage').innerHTML=`
    <div class="product-detail product-detail-v3">
      <div class="detail-visual product-image-${slugCat(p.category)} amazon-image-zone">
        <span class="product-badge">${p.badge}</span>
        ${catalog.imageUrl?`<img src="${escapeHtml(catalog.imageUrl)}" alt="${escapeHtml(title)}">`:`<span class="product-main-emoji">${p.icon}</span><small>Imagen oficial disponible al activar la sincronización con Amazon</small>`}
      </div>
      <div class="detail-copy">
        <a class="back-link" href="/categoria?cat=${encodeURIComponent(p.category)}">← ${p.category}</a>
        <span class="product-page-kicker">FICHA DEL PRODUCTO</span>
        <h1>${escapeHtml(title)}</h1>
        ${catalog.brand?`<p class="brand-line">Marca: <strong>${escapeHtml(catalog.brand)}</strong></p>`:''}
        <div class="detail-score">MePillo <strong>${p.editorial.score}/10</strong></div>
        <p class="detail-lead">${escapeHtml(p.editorial.summary)}</p>
        <div class="quick-feature-grid">${quickFeatures(catalog.features)}</div>
        <div class="product-identifiers"><span><small>Marketplace</small><strong>Amazon.es</strong></span><span><small>ASIN</small><strong>${p.amazon.asin||'Pendiente'}</strong></span></div>
        <a class="primary-btn detail-buy" href="${p.amazon.directUrl}" target="_blank" rel="nofollow sponsored noopener">VER EN AMAZON.ES →</a>
        <p class="affiliate-note">Como afiliado de Amazon, MePillo puede obtener ingresos por compras adscritas que cumplan los requisitos. Precio y disponibilidad se consultan directamente en Amazon.es.</p>
      </div>
    </div>

    <section class="product-section product-features-section">
      <div class="section-title-block"><span class="section-kicker">LO MÁS IMPORTANTE</span><h2>Características destacadas</h2><p>Un resumen rápido de lo que ofrece este producto antes de ir a Amazon.</p></div>
      ${featureList(catalog.features)}
    </section>

    <div class="product-info-grid product-info-grid-v3">
      <section class="info-panel amazon-panel"><span class="section-kicker">FICHA TÉCNICA</span><h2>Especificaciones y compatibilidad</h2>${specsTable(catalog.specifications)}</section>
      <section class="info-panel editorial-panel"><span class="section-kicker">RECOMENDACIÓN MEPILLO</span><h2>¿Para quién merece la pena?</h2><div class="best-for best-for-prominent"><strong>Ideal para</strong><span>${escapeHtml(p.editorial.bestFor)}</span></div><h3 class="subsection-title">Por qué lo recomendamos</h3><ul class="editorial-list">${p.editorial.why.map(x=>`<li>✓ ${escapeHtml(x)}</li>`).join('')}</ul></section>
    </div>

    <section class="product-section analysis-section"><div class="section-title-block"><span class="section-kicker">ANÁLISIS PROPIO</span><h2>Pros y puntos a tener en cuenta</h2></div><div class="pros-cons pros-cons-v3"><div class="pros-box"><h3>Lo que nos gusta</h3><ul>${p.editorial.pros.map(x=>`<li><span>+</span>${escapeHtml(x)}</li>`).join('')}</ul></div><div class="cons-box"><h3>A tener en cuenta</h3>${p.editorial.cons.length?`<ul>${p.editorial.cons.map(x=>`<li><span>–</span>${escapeHtml(x)}</li>`).join('')}</ul>`:'<p class="muted-copy">Sin observaciones destacables por ahora.</p>'}</div></div></section>

    <div class="catalog-note">La estructura de esta ficha ya está preparada para que título, imagen, características y especificaciones puedan actualizarse automáticamente mediante las herramientas autorizadas de Amazon cuando se active Creators API.</div>`;

  const related=window.MEPILLO_PRODUCTS.filter(x=>x.category===p.category&&x.slug!==p.slug).slice(0,4);
  document.getElementById('relatedGrid').innerHTML=related.length?related.map(card).join(''):'<p class="muted-copy">Próximamente añadiremos más productos relacionados.</p>';
}
render();
