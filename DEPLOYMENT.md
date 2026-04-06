# Deployment Guide — Premier Way Maker

Full step-by-step to get the app live on Vercel with MongoDB Atlas,
PayPal sandbox, and Gmail email.

---

## 1. MongoDB Atlas (Free Tier)

1. Go to https://cloud.mongodb.com and sign up / log in.
2. Create a new **Free (M0)** cluster — choose any region close to Tirana
   (e.g. Frankfurt `eu-central-1`).
3. Under **Database Access** → Add a database user:
   - Username: `pwmaker`
   - Password: generate a strong one, save it
   - Role: **Read and write to any database**
4. Under **Network Access** → Add IP Address → click **Allow Access from Anywhere**
   (Vercel uses dynamic IPs so `0.0.0.0/0` is required).
5. Click **Connect** on your cluster → **Drivers** → copy the connection string.
   It looks like:
   ```
   mongodb+srv://pwmaker:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<password>` with the password from step 3.
   Append a database name: `...mongodb.net/pwmaker?retryWrites...`

   This is your `MONGODB_URI`.

6. **Seed the admin user** (do this after deploying the API or locally):
   ```bash
   cd api
   MONGODB_URI="your-uri" ADMIN_PASSWORD="choose-a-strong-password" node src/seed.js
   ```

---

## 2. PayPal Sandbox Setup

1. Go to https://developer.paypal.com and log in with your PayPal account.
2. Navigate to **Apps & Credentials** → ensure you are in **Sandbox** mode.
3. Click **Create App**:
   - Name: `Premier Way Maker`
   - Type: **Merchant**
4. Copy **Client ID** → this is `PAYPAL_CLIENT_ID` and `VITE_PAYPAL_CLIENT_ID`.
5. Click **Show** under Secret → this is `PAYPAL_CLIENT_SECRET`.
6. Under the app settings, enable **Webhooks**:
   - URL: `https://your-vercel-domain.vercel.app/api/paypal/webhook`
   - Events to subscribe: `PAYMENT.CAPTURE.COMPLETED`
   - Save and copy the **Webhook ID** → this is `PAYPAL_WEBHOOK_ID`.
7. To test payments, use the sandbox buyer account listed under
   **Sandbox → Accounts** (PayPal generates test accounts automatically).

**Going live later:**
- Switch the **Sandbox/Live** toggle in the PayPal dashboard.
- Create a new Live app (same process).
- Change `PAYPAL_ENV=live` in your environment variables.
- Update `VITE_PAYPAL_CLIENT_ID` to the Live Client ID and redeploy the frontend.

---

## 3. Gmail App Password

> Required because Google blocks "less secure app access".
> An App Password lets Nodemailer authenticate without your real password.

1. Go to https://myaccount.google.com and sign in as `premierwaymaker@gmail.com`.
2. Enable **2-Step Verification** if not already enabled
   (required for App Passwords to appear).
3. Go to https://myaccount.google.com/apppasswords.
4. Select app: **Mail** / Select device: **Other** → type "Premier Way Maker".
5. Click **Generate** → copy the 16-character password (spaces don't matter).
6. This is `GMAIL_APP_PASSWORD`. Store it securely.

---

## 4. Vercel Deployment

### 4a. Create the Blob Store (for CV uploads)

1. In Vercel dashboard → go to your project → **Storage** tab.
2. Click **Create Database** → **Blob**.
3. Name it `pwmaker-cvs`.
4. After creation, go to the Blob store settings → **Tokens** →
   copy the `BLOB_READ_WRITE_TOKEN`.

### 4b. Set Environment Variables

In Vercel -> Project -> **Settings** -> **General**,
configure these **Build & Development Settings**:

| Setting | Value |
|---|---|
| **Build Command** | `npm run build` |
| **Output Directory** | `.` (Select "Override" and type a dot) |
| **Install Command** | `npm install` |

And in **Settings** -> **Environment Variables**,
add ALL of the following for **Production**:

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | Run `openssl rand -hex 32` and paste result |
| `PAYPAL_CLIENT_ID` | From PayPal dashboard |
| `PAYPAL_CLIENT_SECRET` | From PayPal dashboard |
| `PAYPAL_ENV` | `sandbox` (change to `live` later) |
| `PAYPAL_WEBHOOK_ID` | From PayPal webhook settings |
| `GMAIL_USER` | `premierwaymaker@gmail.com` |
| `GMAIL_APP_PASSWORD` | The 16-char App Password |
| `CLIENT_URL` | `https://your-domain.vercel.app` |
| `ADMIN_URL` | `https://your-domain.vercel.app/admin` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | Strong password for dashboard login |
| `BLOB_READ_WRITE_TOKEN` | From Vercel Blob store |
| `VITE_PAYPAL_CLIENT_ID` | Same as `PAYPAL_CLIENT_ID` |
| `NODE_ENV` | `production` |

### 4c. Deploy

```bash
# If you don't have Vercel CLI installed globally:
npx vercel login
npx vercel --prod
```

Or connect the repo in the Vercel dashboard and it will auto-deploy on push.
The root `vercel.json` already handles routing for all three packages (`app`, `admin`, `api`) via modern **Rewrites**.

---

## 5. Post-Deploy Checklist

- [ ] Visit `https://your-domain.vercel.app/api/health` → should return `{"status":"ok","db":"connected"}`
- [ ] Seed the admin (using node locally): `MONGODB_URI="..." ADMIN_PASSWORD="..." node api/src/seed.js`
- [ ] Log in to admin dashboard at `/admin`
- [ ] Submit a test application with a PayPal sandbox buyer account
- [ ] Verify you receive the admin notification email
- [ ] Verify the applicant receives confirmation email
- [ ] Check the application appears as **paid** in the admin dashboard

---

## 6. Custom Domain (Optional)

1. In Vercel -> Project -> **Domains** -> Add your domain.
2. Update DNS records at your registrar as instructed by Vercel.
3. Update `CLIENT_URL` and `ADMIN_URL` env vars to use the custom domain.
4. Update the PayPal webhook URL to use the custom domain.
5. Redeploy (`npx vercel --prod`).

---

## 7. Switching PayPal to Live

When the client is ready to accept real payments:

1. In PayPal developer dashboard → switch to **Live** → create a new Live app.
2. Update in Vercel environment variables:
   - `PAYPAL_ENV` → `live`
   - `PAYPAL_CLIENT_ID` → Live Client ID
   - `PAYPAL_CLIENT_SECRET` → Live Secret
   - `PAYPAL_WEBHOOK_ID` → new webhook ID (re-register the webhook URL under Live)
   - `VITE_PAYPAL_CLIENT_ID` → Live Client ID
3. Trigger a redeploy in Vercel.
4. Do a real €1 test transaction to confirm end-to-end.

---

## File Changes Summary

These are the files that changed from the original codebase:

| File | Change |
|---|---|
| `api/src/services/paypal.service.js` | **NEW** — PayPal Orders API |
| `api/src/controllers/paypal.controller.js` | **NEW** — create-order, capture-order, webhook |
| `api/src/routes/paypal.routes.js` | **NEW** — `/api/paypal/*` routes |
| `api/src/services/email.service.js` | **REPLACED** — real Nodemailer/Gmail implementation |
| `api/src/controllers/apply.controller.js` | **UPDATED** — removed payment bypass, returns `applicationId` |
| `api/src/models/Application.model.js` | **UPDATED** — added `paypalOrderId` field |
| `api/src/config/env.js` | **UPDATED** — added PayPal + Gmail vars, removed Stripe |
| `api/src/routes/index.js` | **UPDATED** — registered PayPal routes, removed Stripe webhook |
| `api/src/app.js` | **UPDATED** — removed Stripe raw body mount |
| `api/package.json` | **UPDATED** — removed `stripe`, added `nodemailer` |
| `app/src/pages/Payment.jsx` | **REPLACED** — PayPal JS SDK buttons |
| `app/src/hooks/useApplicationForm.js` | **UPDATED** — navigates to `/payment` with `applicationId` |
| `app/src/pages/Success.jsx` | **UPDATED** — handles PayPal navigation state |
| `.env.example` | **UPDATED** — replaced Stripe vars with PayPal + Gmail |
