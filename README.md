# 365 Days Without You (Next.js)
npm install && cp .env.example .env.local && npm run dev
- Site: `/`   Admin: `/admin` (first phone number entered becomes the only admin)
- Storage: `data/db.json` via `lib/db.js` (replace those 2 functions to use a real DB)
- Vercel has a read-only filesystem: use a VPS/Docker, or swap lib/db.js for Vercel KV/Postgres.
- To reset admin: delete `adminHash` from data/db.json. Set SESSION_SECRET and ADMIN_PHONE in production.
