import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
export async function POST(req) {
  const db = await readDb()
  if (!isAdmin(db)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { date } = await req.json()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: 'bad date' }, { status: 400 })
  db.start = date; await writeDb(db); return NextResponse.json({ ok: true })
}
