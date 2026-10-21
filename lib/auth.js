import crypto from 'crypto'
import { cookies } from 'next/headers'
const SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me'
const sig = (v) => crypto.createHmac('sha256', SECRET).update(v).digest('hex')
export const hashPhone = (p) => crypto.createHash('sha256').update('b365:' + p).digest('hex')
export const normPhone = (s) =>
  String(s || '').replace(/[۰-۹]/g, (c) => c.charCodeAt(0) - 1776)
    .replace(/[٠-٩]/g, (c) => c.charCodeAt(0) - 1632).replace(/\D/g, '')
export const makeToken = (h) => h + '.' + sig(h)
export function isAdmin(db) {
  const t = cookies().get('s')?.value
  if (!t || !db.adminHash) return false
  const [h, s] = t.split('.')
  return h === db.adminHash && s === sig(h)
}
