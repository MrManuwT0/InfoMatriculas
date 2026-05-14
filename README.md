# VehículoInfo 🚗

Consulta de vehículos europeos por matrícula real usando la API de **Regcheck**.

---

## Archivos del proyecto

```
vehiculoinfo/
├── server.js               ← Backend Node.js (proxy seguro a Regcheck)
├── package.json            ← Dependencias Node
├── vehiculo-matricula.html ← Frontend (renombrar a index.html)
└── README.md
```

---

## Instalación y arranque local

### 1. Instalar Node.js
Descárgalo de https://nodejs.org (versión LTS recomendada).

### 2. Instalar dependencias
Abre una terminal en la carpeta del proyecto y ejecuta:
```bash
npm install
```

### 3. Renombrar el HTML
```bash
mv vehiculo-matricula.html index.html
```

### 4. Arrancar el servidor
```bash
npm start
```

### 5. Abrir en el navegador
```
http://localhost:3000
```

---

## Publicar en producción (hosting)

### Opción A — Railway (gratis, recomendado)
1. Crea cuenta en https://railway.app
2. Sube los archivos (o conecta tu repo de GitHub)
3. Railway detecta automáticamente el `package.json` y arranca `npm start`
4. Te da una URL pública tipo `https://vehiculoinfo.up.railway.app`

### Opción B — Render (gratis)
1. Crea cuenta en https://render.com
2. New → Web Service → conecta tu repositorio
3. Build command: `npm install`
4. Start command: `node server.js`

### Opción C — VPS propio (DigitalOcean, Hetzner, etc.)
```bash
# En el servidor
npm install
npm install -g pm2
pm2 start server.js --name vehiculoinfo
pm2 save
pm2 startup
```

---

## Google AdSense — Activación

Cuando tengas tu cuenta de AdSense aprobada, edita `index.html` y sustituye:

### 1. Publisher ID (en el `<head>`)
```html
<!-- ANTES -->
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"

<!-- DESPUÉS (ejemplo) -->
data-ad-client="ca-pub-1234567890123456"
```

### 2. Slot IDs (4 anuncios en el body)
Crea 4 unidades de anuncio en tu panel de AdSense
(Anuncios → Por unidad de anuncio → Crear anuncio Display responsive)
y sustituye cada placeholder:

| Placeholder   | Anuncio             | Posición                    |
|---------------|---------------------|-----------------------------|
| XXXXXXXXXX    | Anuncio #1 Banner   | Debajo del header           |
| YYYYYYYYYY    | Anuncio #2 Content  | Entre identidad y ficha     |
| ZZZZZZZZZZ    | Anuncio #3 Content  | Antes de datos completos    |
| WWWWWWWWWW    | Anuncio #4 Footer   | Pie de página               |

---

## Créditos Regcheck

- Usuario: `InfoMatriculas`
- Panel: https://www.regcheck.org.uk (login → Dashboard)
- Cada consulta consume 1 crédito
- Paquetes desde £5 (50 créditos)

---

## Países soportados

| País          | Endpoint Regcheck   |
|---------------|---------------------|
| España        | CheckSpain          |
| Alemania      | CheckGermany        |
| Francia       | CheckFrance         |
| Italia        | CheckItaly          |
| Portugal      | CheckPortugal       |
| Reino Unido   | Check               |
| Países Bajos  | CheckNetherlands    |
| Suecia        | CheckSweden         |
| Noruega       | CheckNorway         |
| Finlandia     | CheckFinland        |
| Australia     | CheckAustralia      |
