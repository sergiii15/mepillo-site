function slugCat(c){return c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function productName(p){return p.amazon.catalog.title||p.editorial.displayName}
function productSummary(p){return p.editorial.summary}
function amazonUrl(p){return p.amazon.directUrl}
function card(p){const name=productName(p);return `<article class="product-card"><a class="product-image product-image-${slugCat(p.category)}" href="/producto?p=${p.slug}" aria-label="Ver ${name}"><span class="product-badge">${p.badge}</span><span class="product-emoji">${p.icon}</span></a><div class="product-body"><div class="product-meta"><span class="product-cat">${p.category}</span><span class="score">MePillo ${p.editorial.score}/10</span></div><h3><a href="/producto?p=${p.slug}">${name}</a></h3><p>${productSummary(p)}</p><div class="card-actions"><a class="buy-btn" href="${amazonUrl(p)}" target="_blank" rel="nofollow sponsored noopener">ME LO PILLO →</a><span class="amazon-caption">Ver producto en Amazon.es</span></div></div></article>`}
const mb=document.getElementById('menuBtn'); if(mb) mb.addEventListener('click',()=>document.getElementById('mainNav').classList.toggle('open'));
