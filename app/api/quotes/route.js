import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
const no = () => NextResponse.json({ error: 'forbidden' }, { status: 403 })
export async function POST(req) {
  const db = await readDb(); if (!isAdmin(db)) return no()
  const { fa, en } = await req.json()
  if (!fa?.trim() || !en?.trim()) return NextResponse.json({ error: 'missing' }, { status: 400 })
  db.quotes.push({ id: 'q' + Date.now(), fa: fa.trim().slice(0, 500), en: en.trim().slice(0, 500), t: Date.now() })
  await writeDb(db); return NextResponse.json({ ok: true })
}
export async function DELETE(req) {
  const db = await readDb(); if (!isAdmin(db)) return no()
  const id = new URL(req.url).searchParams.get('id')
  db.quotes = db.quotes.filter((q) => q.id !== id)
  await writeDb(db); return NextResponse.json({ ok: true })
}
