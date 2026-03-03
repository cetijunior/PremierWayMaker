# Premier Way Maker

Job and visa application platform for Albania. Public-facing app for applicants, admin dashboard for managing applications, and API backend with Stripe payments.

## Overview

| Package | Purpose |
|---------|---------|
| **app** | Public website (React, Vite) — apply forms, Stripe embedded payment, success page |
| **admin** | Admin dashboard (React, Vite) — login, list/filter applications, download CVs, delete |
| **api** | Backend (Node, Express) — apply submission, Stripe checkout, webhooks, admin auth |

## Prerequisites

- Node.js 18+
- MongoDB
- Stripe account

## Local Setup

1. **Clone and install dependencies**

   ```bash
   cd api && npm install
   cd ../app && npm install
   cd ../admin && npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env` at the project root and fill in values:

   ```bash
   cp .env.example .env
   ```

   Required for API: `MONGODB_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CLIENT_URL`.  
   For Stripe publishable key in the app: `VITE_STRIPE_PUBLISHABLE_KEY`.

3. **Run locally**

   ```bash
   # Terminal 1 - API
   cd api && npm run dev

   # Terminal 2 - App (port 3000)
   cd app && npm run dev

   # Terminal 3 - Admin (port 3001)
   cd admin && npm run dev
   ```

   - App: http://localhost:3000  
   - Admin: http://localhost:3001  
   - API: http://localhost:5001 (proxied from app/admin via `/api`)

## Environment Variables

See [.env.example](.env.example) for the full list.

| Variable | Required | Notes |
|----------|----------|-------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes (prod) | Secret for admin JWT |
| `STRIPE_SECRET_KEY` | Yes (prod) | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes (prod) | Stripe webhook signing secret |
| `CLIENT_URL` | Yes (prod) | Public app URL (e.g. https://yourdomain.com) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (baked into app build) |
| `BLOB_READ_WRITE_TOKEN` | Vercel only | Required for CV persistence on Vercel serverless |

## Deployment (Vercel)

1. Connect the repo to Vercel.
2. Set all environment variables in Project Settings for Production/Preview.
3. Ensure `VITE_STRIPE_PUBLISHABLE_KEY` is set for the App build.
4. Create a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN` for the API.
5. Configure Stripe webhook to `https://yourdomain.com/api/stripe/webhook`.

CV uploads require Vercel Blob on serverless; without it, files are not persisted between requests.

## Folder Structure

```
├── api/               # Express API
│   ├── src/
│   │   ├── config/    # db, env, stripe
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/  # stripe, storage, email
│   │   └── utils/
│   └── index.js       # Vercel serverless entry
├── app/               # Public React app
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       └── i18n/
├── admin/             # Admin React app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── context/
└── vercel.json        # Vercel build and routing
```

## Key Flows

1. **Apply → Payment → Success**  
   User fills form on `/apply/inside` or `/apply/outside`, clicks Pay & Submit, is sent to the embedded Stripe payment page, then redirected to Success after payment.

2. **Admin**  
   Login at `/admin`, view applications with filters, download CVs, delete applications.

3. **Webhook**  
   Stripe sends `checkout.session.completed` to `/api/stripe/webhook`, which marks the application as paid and triggers confirmation email.

## Maintenance

See [MAINTENANCE.md](MAINTENANCE.md) for guidance on adding features and making changes safely.
