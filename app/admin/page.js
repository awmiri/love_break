'use client'
import { useEffect, useState } from 'react'

export default function Admin() {
  const [st, setSt] = useState(null)
  const [phone, setPhone] = useState('')
  const [fa, setFa] = useState('')
  const [en, setEn] = useState('')
  const [date, setDate] = useState('')
  const [msg, setMsg] = useState('')

  const load = () => fetch('/api/state').then((r) => r.json()).then((s) => { setSt(s); if (s.start) setDate(s.start) })
  useEffect(() => { load() }, [])
  const call = async (url, method, body) => {
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) })
    const j = await r.json().catch(() => ({})); setMsg(r.ok ? '✓' : j.error || 'خطا'); if (r.ok) load(); return r.ok
  }

  if (!st) return <main />
  if (!st.admin) return (
    <main><section className="card fa" style={{ maxWidth: 400, margin: '60px auto 0', textAlign: 'right' }}>
      <h2>ورود ادمین</h2>
      <p className="note">{st.hasAdmin ? 'شماره‌ی ادمین را وارد کن.' : 'اولین شماره‌ای که ثبت شود ادمین می‌شود.'}</p>
      <input style={{ direction: 'ltr' }} type="tel" placeholder="09123456789" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <div className="row"><button className="pri" onClick={() => call('/api/login', 'POST', { phone })}>ورود</button><span className="note">{msg}</span></div>
    </section></main>
  )
  return (
    <main><section className="card">
      <h2>Admin panel</h2>
      <label>Persian text · متن فارسی</label>
      <textarea className="fa" rows={2} value={fa} onChange={(e) => setFa(e.target.value)} />
      <label>English translation</label>
      <textarea rows={2} value={en} onChange={(e) => setEn(e.target.value)} />
      <div className="row"><button className="pri" onClick={async () => { if (await call('/api/quotes', 'POST', { fa, en })) { setFa(''); setEn('') } }}>Add quote</button><span className="note">{msg}</span></div>
      <label style={{ marginTop: 22 }}>Breakup date (day 0)</label>
      <div className="row" style={{ marginTop: 0 }}>
        <input type="date" style={{ maxWidth: 220 }} value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={() => call('/api/start', 'POST', { date })}>Save date</button>
      </div>
      <div className="list">{st.quotes.map((q) => (
        <div className="item" key={q.id}>
          <div><span className="fa">{q.fa}</span><small>{q.en}</small></div>
          <button onClick={() => call('/api/quotes?id=' + q.id, 'DELETE')}>Delete</button>
        </div>
      ))}</div>
      <div className="row"><button onClick={async () => { await call('/api/logout', 'POST'); load() }}>Logout</button><a className="note" href="/">← site</a></div>
    </section></main>
  )
}
