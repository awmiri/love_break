import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
export const dynamic = 'force-dynamic'
export async function GET() {
  const db = await readDb()
  const quotes = [...db.quotes].sort((a, b) => a.t - b.t)
  return NextResponse.json({ start: db.start, quotes, admin: isAdmin(db), hasAdmin: !!db.adminHash })
}
