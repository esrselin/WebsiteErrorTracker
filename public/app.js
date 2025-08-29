async function scan(url) {
const r = await fetch('/api/scan', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ url })
});
return await r.json();
}


async function history() {
const r = await fetch('/api/history?limit=20');
return await r.json();
}


function renderLatest(el, data) {
el.textContent = JSON.stringify(data, null, 2);
}


function renderHistory(table, rows) {
const th = `
<tr>
<th>ID</th>
<th>URL</th>
<th>Status</th>
<th>Resp (ms)</th>
<th>Checked</th>
<th>Broken</th>
<th>Created</th>
</tr>`;
const tr = rows.map(r => `
<tr>
<td>${r.id}</td>
<td><a href="/api/scan/${r.id}" target="_blank">${r.url}</a></td>
<td>${r.status ?? '—'}</td>
<td>${r.response_ms ?? '—'}</td>
<td>${r.checked_links}</td>
<td>${r.broken_links}</td>
<td>${r.created_at}</td>
</tr>
`).join('');
table.innerHTML = th + tr;
}


async function bootstrap() {
const form = document.getElementById('scan-form');
const urlInput = document.getElementById('url');
const latest = document.getElementById('latest');
const table = document.getElementById('history');


renderHistory(table, await history());


form.addEventListener('submit', async (e) => {
e.preventDefault();
const url = urlInput.value.trim();
if (!url) return;
latest.textContent = 'Scanning…';
const data = await scan(url);
renderLatest(latest, data);
renderHistory(table, await history());
});
}


document.addEventListener('DOMContentLoaded', bootstrap);