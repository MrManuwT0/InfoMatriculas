/**
 * VehículoInfo — Servidor backend
 * Node.js + Express · Proxy seguro para Regcheck API
 *
 * INSTALACIÓN:
 *   npm install express node-fetch cors
 *
 * ARRANCAR:
 *   node server.js
 *
 * El servidor escucha en http://localhost:3000
 * El frontend (index.html) debe estar en la misma carpeta.
 */

const express  = require('express');
const cors     = require('cors');
const path     = require('path');

// node-fetch v2 (CommonJS compatible)
let fetch;
(async () => { fetch = (await import('node-fetch')).default; })();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── CONFIG ───────────────────────────────────────────────────────────
const REGCHECK_USER = 'InfoMatriculas';

const COUNTRY_ENDPOINTS = {
  Spain:          'CheckSpain',
  Germany:        'CheckGermany',
  France:         'CheckFrance',
  Italy:          'CheckItaly',
  Portugal:       'CheckPortugal',
  UnitedKingdom:  'Check',
  Netherlands:    'CheckNetherlands',
  Sweden:         'CheckSweden',
  Norway:         'CheckNorway',
  Finland:        'CheckFinland',
  Australia:      'CheckAustralia',
};

// ── MIDDLEWARE ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));   // serve index.html

// ── VEHICLE LOOKUP ───────────────────────────────────────────────────
app.get('/api/vehicle', async (req, res) => {
  const { plate, country = 'Spain' } = req.query;

  if (!plate) {
    return res.status(400).json({ error: 'Falta el parámetro plate' });
  }

  const endpoint = COUNTRY_ENDPOINTS[country];
  if (!endpoint) {
    return res.status(400).json({ error: `País no soportado: ${country}` });
  }

  const url = `https://www.regcheck.org.uk/api/reg.asmx/${endpoint}` +
              `?RegistrationNumber=${encodeURIComponent(plate)}` +
              `&username=${encodeURIComponent(REGCHECK_USER)}`;

  try {
    // Wait until fetch is loaded (first request may arrive before async import)
    if (!fetch) await new Promise(r => setTimeout(r, 300));

    const response = await fetch(url, { timeout: 12000 });
    const text     = await response.text();

    // Extract vehicleJson from XML
    const match = text.match(/<vehicleJson[^>]*>([\s\S]*?)<\/vehicleJson>/i);
    if (!match) {
      return res.status(404).json({
        error: 'No se encontraron datos para esta matrícula.',
        detail: 'La matrícula puede ser incorrecta, el país seleccionado no coincide, o los créditos de la cuenta están agotados.'
      });
    }

    const jsonStr = match[1]
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'");

    let vehicleData;
    try {
      vehicleData = JSON.parse(jsonStr);
    } catch (e) {
      return res.status(500).json({ error: 'Error al parsear la respuesta de Regcheck.' });
    }

    return res.json({ ok: true, data: vehicleData });

  } catch (err) {
    console.error('Regcheck fetch error:', err.message);
    return res.status(502).json({
      error: 'No se pudo conectar con Regcheck API.',
      detail: err.message
    });
  }
});

// ── CREDITS CHECK ────────────────────────────────────────────────────
app.get('/api/credits', async (req, res) => {
  try {
    if (!fetch) await new Promise(r => setTimeout(r, 300));
    const response = await fetch(
      `https://www.regcheck.org.uk/ajax/getcredits.aspx?username=${REGCHECK_USER}`,
      { timeout: 6000 }
    );
    const text = await response.text();
    const n    = parseInt(text.replace(/\D/g, ''));
    return res.json({ credits: isNaN(n) ? null : n });
  } catch (e) {
    return res.json({ credits: null });
  }
});

// ── START ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚗  VehículoInfo server running`);
  console.log(`    Local:   http://localhost:${PORT}`);
  console.log(`    API:     http://localhost:${PORT}/api/vehicle?plate=1234BCD&country=Spain`);
  console.log(`    Credits: http://localhost:${PORT}/api/credits\n`);
});
