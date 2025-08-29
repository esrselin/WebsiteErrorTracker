import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function createDb() {
const db = await open({
filename: path.join(__dirname, 'data.sqlite'),
driver: sqlite3.Database,
});
await db.exec(`PRAGMA journal_mode = WAL;`);
await db.exec((await import('fs/promises')).readFile(path.join(__dirname, 'sql/init.sql'), 'utf8'));
return db;
}