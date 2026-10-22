'use client'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [data, setData] = useState({ start: null, quotes: [] })
  const [now, setNow] = useState(Date.now())
  const [i, setI] = useState(0)
  const [hearts, setHearts] = useState([])
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  const play = () => audioRef.current?.play().catch(() => {})

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

  // تلاش برای autoplay؛ اگه مرورگر اجازه نداد، با اولین لمس (بیرون از دکمه‌ی موزیک) شروع می‌شه
  useEffect(() => {
    const a = audioRef.current
    if (!a) return

    const onFirst = (e) => {
      if (e.target instanceof Element && e.target.closest('.music')) return
      window.removeEventListener('pointerdown', onFirst, true)
      window.removeEventListener('keydown', onFirst, true)
      if (a.paused) a.play().catch(() => {})
    }

    a.play().catch(() => {
      window.addEventListener('pointerdown', onFirst, true)
      window.addEventListener('keydown', onFirst, true)
    })

    return () => {
      window.removeEventListener('pointerdown', onFirst, true)
      window.removeEventListener('keydown', onFirst, true)
    }
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
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <button
        style={{ position: 'fixed', top: 75, left: 15, zIndex: 10 }}
        className={'music' + (playing ? ' on' : '')}
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
      >
        <span className="ring" />
        {playing ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
          </svg>
        )}
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