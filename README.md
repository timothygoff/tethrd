# tethrd

Two-party escrow web app. Funds held until both parties confirm — timer expires, everyone gets their money back automatically.

Built with Next.js 16, deployed on Vercel at [tethrd.io](https://tethrd.io).

## Stack

- **Frontend/App:** Next.js 16 (App Router)
- **Payments:** Stripe Connect (sandbox)
- **Deployment:** Vercel

## Dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Status

Pre-MVP — landing page + waitlist live. Auth, escrow flow, and Stripe Connect in progress.
