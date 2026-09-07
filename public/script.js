const products = window.MEPILLO_PRODUCTS || [];
function productName(p){return p?.amazon?.catalog?.title || p?.editorial?.displayName || 'Producto'}

function amazonUrl(p){return p.amazon.directUrl}


const grid = document.getElementById('productGrid');
const resultCount = document.getElementById('resultCount');
let currentCategory = 'Todos';
let expanded = false;

function productCard(p){
  return `
    <article class="product-card" data-name="${productName(p).toLowerCase()}">
      <div class="product-image product-image-${p.category.toLowerCase().replace('í','i')}" aria-hidden="true">
        <span class="product-badge">${p.badge}</span>
        <span class="product-emoji">${p.icon}</span>
      </div>
      <div class="product-body">
        <div class="product-meta"><span class="product-cat">${p.category}</span><span class="score">MePillo ${p.editorial.score}/10</span></div>
        <h3><a href="/producto?p=${p.slug}">${productName(p)}</a></h3>
        <p>${p.editorial.summary}</p>
        <div class="card-actions">
          <a class="buy-btn" href="${amazonUrl(p)}" target="_blank" rel="nofollow sponsored noopener" aria-label="Ver ${productName(p)} en Amazon">ME LO PILLO →</a>
          <span class="amazon-caption">Ver producto en Amazon.es</span>
        </div>
      </div>
    </article>`;
}

function renderProducts(query=''){
  const q = query.trim().toLowerCase();
  const filtered = products.filter(p =>
    (currentCategory === 'Todos' || currentCategory === 'Ofertas' || p.category === currentCategory) &&
    (!q || `${productName(p)} ${p.category} ${p.editorial.summary} ${p.badge}`.toLowerCase().includes(q))
  );
  const visible = expanded ? filtered : filtered.slice(0,10);
  grid.innerHTML = visible.map(productCard).join('');
  resultCount.textContent = `${filtered.length} producto${filtered.length === 1 ? '' : 's'}`;
  if(!visible.length) grid.innerHTML = '<div class="empty-state"><span>🔎</span><h3>No encontramos resultados</h3><p>Prueba otra palabra o selecciona otra categoría.</p></div>';
}

renderProducts();

document.getElementById('searchForm').addEventListener('submit', e => {
  e.preventDefault();
  expanded = true;
  currentCategory = 'Todos';
  document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
  renderProducts(document.getElementById('searchInput').value);
  document.getElementById('ofertas').scrollIntoView({behavior:'smooth'});
});

document.getElementById('searchInput').addEventListener('input', e => {
  if(e.target.value.length === 0 || e.target.value.length >= 2){
    expanded = true;
    currentCategory = 'Todos';
    renderProducts(e.target.value);
  }
});

document.getElementById('showAllBtn').addEventListener('click', () => {
  expanded = !expanded;
  document.getElementById('showAllBtn').textContent = expanded ? 'Ver menos ↑' : 'Ver todos →';
  renderProducts(document.getElementById('searchInput').value);
});

document.getElementById('menuBtn').addEventListener('click', () => {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('open');
  document.getElementById('menuBtn').setAttribute('aria-expanded', nav.classList.contains('open'));
});

document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => document.getElementById('mainNav').classList.remove('open')));
