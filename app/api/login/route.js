import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'
import { hashPhone, normPhone, makeToken } from '@/lib/auth'
export async function POST(req) {
  const phone = normPhone((await req.json()).phone)
  if (phone.length < 8) return NextResponse.json({ error: 'شماره معتبر نیست' }, { status: 400 })
  const db = await readDb(); const h = hashPhone(phone)
  if (!db.adminHash) {                       // first number wins
    const only = normPhone(process.env.ADMIN_PHONE)
    if (only && only !== phone) return NextResponse.json({ error: 'این شماره اجازه‌ی ثبت ندارد' }, { status: 403 })
    db.adminHash = h; await writeDb(db)
  } else if (db.adminHash !== h) {
    return NextResponse.json({ error: 'این شماره ادمین نیست' }, { status: 403 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set('s', makeToken(h), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30, secure: process.env.NODE_ENV === 'production' })
  return res
}
