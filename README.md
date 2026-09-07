# MePillo — Firebase Hosting + estructura preparada para Amazon Creators API

## Qué incluye esta versión
- Los 14 productos siguen enlazados a sus URLs de afiliado de Amazon.es.
- Cada producto separa ahora dos bloques de datos:
  - `amazon`: ASIN, marketplace, enlace de afiliado y catálogo que en el futuro vendrá de Creators API.
  - `editorial`: puntuación, resumen, motivos, pros y contenido propio de MePillo.
- `amazon-provider.js` actúa como capa intermedia. Hoy usa datos semilla; después podrá consultar un backend seguro.
- Las fichas muestran zonas preparadas para imagen oficial, título, marca, características y especificaciones.
- Nunca se deben incluir credenciales de Creators API en `public/`.

## ASIN
Se han identificado los ASIN que podían resolverse de los enlaces actuales. Los productos cuyo enlace corto no permitió resolver el destino automáticamente conservan `asin: null` y la ficha muestra “Pendiente”. Cuando tengamos el ASIN o la API, solo hay que completar ese campo.

## Activar Creators API en el futuro
En `public/amazon-provider.js` cambia:
`API_MODE: 'seed'`
por:
`API_MODE: 'backend'`

y configura `AMAZON_API_ENDPOINT` para apuntar a un backend (por ejemplo, Firebase Functions/Cloud Run) que use las credenciales de Amazon de forma privada.

El backend debería devolver un JSON normalizado como:
```json
{
  "title": "Título devuelto por Amazon",
  "brand": "Marca",
  "imageUrl": "https://...",
  "features": ["Característica 1", "Característica 2"],
  "specifications": [
    {"label": "Color", "value": "Negro"},
    {"label": "Modelo", "value": "..."}
  ],
  "lastUpdated": "2026-09-06T00:00:00Z"
}
```

## Probar en local
```powershell
firebase.cmd serve --only hosting
```

## Publicar
```powershell
firebase.cmd deploy --only hosting
```
