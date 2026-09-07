/**
 * Capa de acceso al catálogo de Amazon.
 *
 * HOY: devuelve los datos semilla guardados en data.js y marca lo que falta.
 * FUTURO: cuando Creators API esté habilitada, cambia API_MODE a 'backend' y
 * conecta AMAZON_API_ENDPOINT a una Firebase Function/Cloud Run segura.
 * Las credenciales de Amazon NUNCA deben ir en estos archivos públicos.
 */
window.MEPILLO_AMAZON_CONFIG = {
  API_MODE: 'seed', // 'seed' | 'backend'
  AMAZON_API_ENDPOINT: '/api/amazon/item'
};

window.MepilloAmazon = {
  async getItem(product) {
    const {API_MODE, AMAZON_API_ENDPOINT} = window.MEPILLO_AMAZON_CONFIG;
    if (API_MODE === 'backend' && product.amazon.asin) {
      try {
        const url = `${AMAZON_API_ENDPOINT}?asin=${encodeURIComponent(product.amazon.asin)}&marketplace=${encodeURIComponent(product.amazon.marketplace)}`;
        const response = await fetch(url, {headers:{'Accept':'application/json'}});
        if (!response.ok) throw new Error(`Amazon backend ${response.status}`);
        const item = await response.json();
        return {...product.amazon.catalog, ...item, source:'creators-api'};
      } catch (error) {
        console.warn('Creators API no disponible; usando datos semilla.', error);
      }
    }
    return product.amazon.catalog;
  }
};
