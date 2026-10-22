'use client'
import { useEffect, useRef, useState } from 'react'

const FROM = 27 // شروع تکه‌ی آهنگ (ثانیه)
const TO = 100   // پایان تکه‌ی آهنگ (ثانیه)

export default function Home() {
  const [data, setData] = useState({ start: null, quotes: [] })
  const [now, setNow] = useState(Date.now())
  const [i, setI] = useState(0)
  const [hearts, setHearts] = useState([])
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  // پخش از ابتدای تکه
  const play = () => {
    const a = audioRef.current
    if (!a) return
    if (a.currentTime < FROM || a.currentTime >= TO) a.currentTime = FROM
    a.play().catch(() => {})
  }
  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) play()
    else a.pause()
  }

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

  // اول سعی می‌کند خودکار پخش کند؛ اگر مرورگر نگذاشت، با اولین لمس/کلیک شروع می‌شود
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const ev = ['click', 'touchend', 'keydown']
    const off = () => ev.forEach((e) => window.removeEventListener(e, kick))
    const kick = (e) => {
      off()
      if (e.target.closest?.('.music')) return // خود دکمه کارش را می‌کند
      if (a.paused) play()
    }
    a.currentTime = FROM
    a.play().catch(() => ev.forEach((e) => window.addEventListener(e, kick)))
    return off
  }, [])

  const start = data.start ? new Date(data.start + 'T00:00:00').getTime() : new Date().setHours(0, 0, 0, 0)
  const d = Math.max(0, now - start), days = Math.floor(d / 864e5)
  const n = data.quotes.length, q = data.quotes[n ? i % n : 0]
  const go = (s) => n && setI((i + s + n) % n)

  return (
    <>
      <div className="hearts">{hearts.map((h, k) => (
        <i key={k} style={{ left: h.l + '%', fontSize: h.z, animationDuration: h.d + 's', animationDelay: h.o + 's' }}>{h.s}</i>
      ))}</div>

      <audio
        ref={audioRef}
        src="/music/3TARE.mp3"
        preload="auto"
        onLoadedMetadata={(e) => { if (e.target.paused) e.target.currentTime = FROM }}
        onTimeUpdate={(e) => { const a = e.target; if (a.currentTime >= TO) a.currentTime = FROM }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button style={{position:"absolute" , top:30 , left:15 , zIndex:10000}} className={'music' + (playing ? '' : ' pulse')} onClick={toggle} aria-label="music">
        {playing ? '❚❚' : '▶'}
      </button>

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
          <div className="nav">
            <button onClick={() => go(-1)}>‹</button>
            <span className="dots">{n ? (i % n) + 1 : 0} / {n}</span>
            <button onClick={() => go(1)}>›</button>
          </div>
        </section>
      </main>
    </>
  )
}