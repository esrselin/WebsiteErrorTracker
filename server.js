import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { createDb } from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SCAN_TIMEOUT_MS = Number(process.env.SCAN_TIMEOUT_MS || 10000);
const MAX_LINKS = 20;

const db = await createDb();

function withTimeout(ms) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(new Error('timeout')), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(id) };
}

function toAbsoluteUrl(base, href) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

async function headOrGet(url, signal) {
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal });
    return r;
  } catch {
    const r = await fetch(url, { method: 'GET', redirect: 'follow', signal });
    return r;
  }
}

app.post('/api/scan', async (req, res) => {
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: 'url is required' });

  let status = null;
  let response_ms = null;
  let checked = 0;
  let broken = 0;
  let scanId = null;

  const timer = withTimeout(SCAN_TIMEOUT_MS);

  try {
    const t0 = Date.now();
    const resp = await fetch(url, { redirect: 'follow', signal: timer.signal });
    status = resp.status;
    const html = await resp.text();
    response_ms = Date.now() - t0;

    const insertScan = await db.run(
      'INSERT INTO scans (url, status, response_ms) VALUES (?, ?, ?)',
      url,
      status,
      response_ms
    );
    scanId = insertScan.lastID;

    const $ = cheerio.load(html);
    const candidates = new Set();

    $('a[href]')
      .slice(0, MAX_LINKS)
      .each((_, el) => {
        const abs = toAbsoluteUrl(url, $(el).attr('href'));
        if (abs) candidates.add(JSON.stringify({ u: abs, kind: 'page' }));
      });

    $('link[href], script[src], img[src]')
      .slice(0, MAX_LINKS)
      .each((_, el) => {
        const href = $(el).attr('href') || $(el).attr('src');
        const abs = toAbsoluteUrl(url, href);
        if (abs) candidates.add(JSON.stringify({ u: abs, kind: 'asset' }));
      });

    const list = Array.from(candidates).map(JSON.parse).slice(0, MAX_LINKS);

    for (const item of list) {
      checked++;
      try {
        const subTimer = withTimeout(Math.floor(SCAN_TIMEOUT_MS / 2));
        const r = await headOrGet(item.u, subTimer.signal);
        const ok = r.ok ? 1 : 0;
        if (!ok) broken++;

        await db.run(
          'INSERT INTO scan_details (scan_id, link, status, ok, kind) VALUES (?, ?, ?, ?, ?)',
          scanId,
          item.u,
          r.status,
          ok,
          item.kind
        );

        subTimer.cancel();
      } catch {
        broken++;
        await db.run(
          'INSERT INTO scan_details (scan_id, link, status, ok, kind) VALUES (?, ?, ?, ?, ?)',
          scanId,
          item.u,
          null,
          0,
          item.kind
        );
      }
    }

    await db.run(
      'UPDATE scans SET checked_links = ?, broken_links = ? WHERE id = ?',
      checked,
      broken,
      scanId
    );

    timer.cancel();
    return res.json({
      id: scanId,
      url,
      status,
      response_ms,
      checked_links: checked,
      broken_links: broken
    });
  } catch (err) {
    timer.cancel();

    if (!scanId) {
      const failed = await db.run(
        'INSERT INTO scans (url, status, response_ms) VALUES (?, ?, ?)',
        url,
        null,
        null
      );
      scanId = failed.lastID;
    }

    return res
      .status(500)
      .json({ error: err?.message || 'scan failed', id: scanId });
  }
});

app.get('/api/scan/:id', async (req, res) => {
  const id = Number(req.params.id);
  const scan = await db.get('SELECT * FROM scans WHERE id = ?', id);
  if (!scan) return res.status(404).json({ error: 'not found' });

  const details = await db.all(
    'SELECT link, status, ok, kind FROM scan_details WHERE scan_id = ? ORDER BY id DESC',
    id
  );

  return res.json({ scan, details });
});

app.get('/api/history', async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const rows = await db.all(
    'SELECT * FROM scans ORDER BY id DESC LIMIT ?',
    limit
  );
  return res.json(rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Website Error Tracker running at http://localhost:${PORT}`);
});
