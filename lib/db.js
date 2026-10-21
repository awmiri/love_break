// All storage lives here. Swap these two functions for Postgres/Mongo/KV later.
import fs from 'fs/promises'
import path from 'path'
const FILE = path.join(process.cwd(), 'data', 'db.json')
const DEFAULT = {
  start: '2026-10-17', adminHash: null,
  quotes: [
    { id: 'd1', fa: 'هر روز بدون تو، کمی قوی‌تر می‌شوم.', en: 'Every day without you, I grow a little stronger.', t: 1 },
    { id: 'd2', fa: 'دلتنگی یعنی عشقی که جایی برای رفتن ندارد.', en: 'Missing you is love with nowhere left to go.', t: 2 },
    { id: 'd3', fa: 'زخم‌ها می‌مانند، اما درد کم‌کم می‌رود.', en: 'Scars stay, but the pain slowly fades.', t: 3 },
    { id: 'd4', fa: 'از خودم شروع می‌کنم؛ دوباره.', en: 'I’m starting again, from myself.', t: 4 },
  ],
}
export async function readDb() {
  try { return JSON.parse(await fs.readFile(FILE, 'utf8')) } catch { return structuredClone(DEFAULT) }
}
export async function writeDb(d) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  await fs.writeFile(FILE, JSON.stringify(d, null, 2))
}
