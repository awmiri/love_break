'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState({ start: null, quotes: [] })
  const [now, setNow] = useState(Date.now())
  const [i, setI] = useState(0)
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    fetch('/api/state').then((r) => r.json()).then(setData)
    setHearts(Array.from({ length: 16 }, (_, k) => ({
      s: ['♥', '♡', '✦', '·'][k % 4], l: Math.random() * 100, z: 12 + Math.random() * 22,
      d: 12 + Math.random() * 14, o: -Math.random() * 20,
    })))
    const a = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(a)
  }, [])
  useEffect(() => {
    if (!data.quotes.length) return
    const b = setInterval(() => setI((x) => (x + 1) % data.quotes.length), 12000)
    return () => clearInterval(b)
  }, [data.quotes.length])

  const start = data.start ? new Date(data.start + 'T00:00:00').getTime() : new Date().setHours(0, 0, 0, 0)
  const d = Math.max(0, now - start), days = Math.floor(d / 864e5)
  const n = data.quotes.length, q = data.quotes[n ? i % n : 0]
  const go = (s) => n && setI((i + s + n) % n)

  return (
    <>
      <div className="hearts">{hearts.map((h, k) => (
        <i key={k} style={{ left: h.l + '%', fontSize: h.z, animationDuration: h.d + 's', animationDelay: h.o + 's' }}>{h.s}</i>
      ))}</div>
      <main>
        <h1>Days without you</h1>
        <p className="big">{days}</p>
        <p className="sub">days of healing</p>
        <p className="sub2 fa">روزهایی که بی‌تو گذشت</p>
        <div className="clock">
          <div><b>{Math.floor(d / 36e5) % 24}</b><span>hours</span></div>
          <div><b>{Math.floor(d / 6e4) % 60}</b><span>min</span></div>
          <div><b>{Math.floor(d / 1e3) % 60}</b><span>sec</span></div>
        </div>
        <div className="bar"><div style={{ width: Math.min(100, (days / 365) * 100) + '%' }} /></div>
        <div className="pct">Day {days} of 365{days >= 365 ? ' · you made it ♥' : ''}</div>
        <section className="card">
          <div className="q">{q && (<><div className="fa">{q.fa}</div><div className="en">{q.en}</div></>)}</div>
          <div className="nav"><button onClick={() => go(-1)}>‹</button><span className="dots">{n ? (i % n) + 1 : 0} / {n}</span><button onClick={() => go(1)}>›</button></div>
        </section>
      </main>
    </>
  )
}
