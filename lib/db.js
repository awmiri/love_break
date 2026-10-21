// All storage lives here. Swap these two functions for Postgres/Mongo/KV later.
import fs from 'fs/promises'
import path from 'path'
const URL = process.env.DATABASE_URL
const FILE = path.join(process.cwd(), 'data', 'db.json')
// const DEFAULT = {
//   start: '2026-10-17', adminHash: null,
//   quotes: [
//     { id: 'd1', fa: 'هر روز بدون تو، کمی قوی‌تر می‌شوم.', en: 'Every day without you, I grow a little stronger.', t: 1 },
//     { id: 'd2', fa: 'دلتنگی یعنی عشقی که جایی برای رفتن ندارد.', en: 'Missing you is love with nowhere left to go.', t: 2 },
//     { id: 'd3', fa: 'زخم‌ها می‌مانند، اما درد کم‌کم می‌رود.', en: 'Scars stay, but the pain slowly fades.', t: 3 },
//     { id: 'd4', fa: 'از خودم شروع می‌کنم؛ دوباره.', en: 'I’m starting again, from myself.', t: 4 },
//   ],
// }
let pool
async function getPool() {
  if (!pool) {
    const { Pool } = await import('pg')
    pool = new Pool({ connectionString: URL, ssl: { rejectUnauthorized: false } })
    await pool.query('create table if not exists kv (k text primary key, v jsonb not null)')
  }
  return pool
}
export async function readDb() {
  if (URL) {
    const r = await (await getPool()).query("select v from kv where k = 'db'")
    return r.rows[0]?.v ?? structuredClone(DEFAULT)
  }
  try { return JSON.parse(await fs.readFile(FILE, 'utf8')) } catch { return structuredClone(DEFAULT) }
}
export async function writeDb(d) {
  if (URL) {
    await (await getPool()).query(
      "insert into kv (k, v) values ('db', $1::jsonb) on conflict (k) do update set v = excluded.v",
      [JSON.stringify(d)])
    return
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  await fs.writeFile(FILE, JSON.stringify(d, null, 2))
}
