# Maintenance Guide

How to make changes safely without breaking the application.

## Current Architecture Snapshot

- Database is MongoDB via Mongoose.
- Payment flow is provider-aware: PayPal primary, Stripe optional fallback.
- Application lifecycle is now: submit form -> create pending application -> initialize payment provider -> confirm payment -> update status in admin.
- Admin dashboard now reads only real API data (seed fallback removed).

## End-to-End Flow (App -> API -> Admin)

1. App submits `POST /api/apply` with form data + CV.
2. API validates booking and creates an `Application` with `paymentStatus: pending`.
3. API initializes payment using configured provider:
   - PayPal returns `orderId` + `approvalUrl`.
   - Stripe returns `sessionId` + `clientSecret`.
4. App routes user to `/payment`:
   - PayPal: redirect button to approval URL.
   - Stripe: embedded checkout.
5. Payment confirmation:
   - PayPal: app calls `POST /api/apply/paypal/confirm` with `orderId`.
   - Stripe: webhook updates payment on `checkout.session.completed`.
6. Success page resolves final status from API.
7. Admin reads provider-aware payment state and can filter by status/provider.

## Adding a New Route or Controller

1. Create the controller in `api/src/controllers/` (e.g. `feature.controller.js`).
2. Create a route file in `api/src/routes/` (e.g. `feature.routes.js`).
3. Register in `api/src/routes/index.js`:
   ```js
   const featureRoutes = require('./feature.routes');
   router.use('/feature', featureRoutes);
   ```
4. Add validation middleware if the route accepts body/params.
5. Use `ApiError` for operational errors; let unexpected errors bubble to `errorHandler`.

Note:

- Stripe webhook route is mounted in `api/src/app.js` at `/api/stripe/webhook` before `express.json()`.
- Do not also mount the same webhook route in `api/src/routes/index.js`.

## Adding a New Environment Variable

1. Add to `.env.example` with a brief comment.
2. Add to `api/src/config/env.js` if the API needs it.
3. For app build-time vars (Vite), use `VITE_` prefix and add to `.env.example`.
4. If required in production, add to `REQUIRED_IN_PRODUCTION` in `api/src/config/env.js`.

Current payment/provider env keys in API:

- `PAYMENT_PROVIDER` (`paypal` or `stripe`; defaults to `paypal`)
- `ENABLE_STRIPE_FALLBACK` (`true` or `false`)
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_API_BASE` (defaults to sandbox)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Behavior in development:

- If PayPal keys are missing and Stripe key exists, provider falls back to Stripe with a warning.
- If PayPal keys are missing and Stripe key is also missing, payment initialization will fail until configured.

## Changing Application Types or Prices

Prices are centralized in `api/src/constants/pricing.js`:

- `PRICES_CENTS`: { inside: 5000, outside: 30000 }
- `PRICES_EUROS`: { inside: 50, outside: 300 }

### Currency Management

The application currently uses **USD** for testing purposes in Sandbox to avoid issues with some PayPal Sandbox accounts that are primary in USD.

**Files to update for currency changes:**
- **Backend:** `api/src/services/paypal.service.js` (update `currency_code`)
- **Frontend:** `app/src/pages/Payment.jsx` (update `currency` in `PayPalScriptProvider`)

> [!IMPORTANT]
> The site's display labels and pricing constants (`api/src/constants/pricing.js`) still use EUR symbols. Ensure the payment gateway currency matches the business logic before deployment.

To add or change a type:

1. Update `api/src/constants/pricing.js`.
2. Update `api/src/models/Application.model.js` enum for `type` if needed.
3. Update `app/src/constants/services.js` `APPLICATION_TYPES` (display labels and prices).
4. Update `app/src/i18n/locales/*.json` for any new labels.
5. Update `api/src/middleware/validate.js` if the `type` enum changes.
6. Update provider labels/descriptions in both:
   - `api/src/services/stripe.service.js`
   - `api/src/services/paypal.service.js`

## Application Model and Payment Fields

`api/src/models/Application.model.js` now includes provider-aware payment fields:

- `paymentStatus`: `pending | paid | failed`
- `paymentProvider`: `paypal | stripe | pending`
- `stripeSessionId`
- `paypalOrderId`
- `externalPaymentId`
- `failureReason`
- `paidAt`
- `paymentAttempts[]`

Important indexes:

- `bookingStart + bookingEnd` for overlap checks
- `paymentStatus + paymentProvider + createdAt` for admin filtering
- indexes on `stripeSessionId`, `paypalOrderId`, `externalPaymentId`

When adding new payment providers or statuses, update:

- schema enums
- relevant indexes
- admin filters
- frontend status mapping/badges

## Payment Services

- Orchestrator: `api/src/services/payment.service.js`
- PayPal: `api/src/services/paypal.service.js`
- Stripe: `api/src/services/stripe.service.js`

Rules:

- Keep provider selection centralized in `payment.service.js`.
- Return a normalized payload to controllers (`provider`, `referenceId`, `checkout`).
- Do not embed provider branching logic in frontend-facing controllers more than necessary.

## Stripe and Webhook Logic

- **Checkout:** `api/src/services/stripe.service.js` — `createCheckoutSession` creates embedded sessions.
- **Webhook:** `api/src/controllers/webhook.controller.js` — handles `checkout.session.completed`, updates `paymentStatus`, sends email.
- **Route:** Webhook is mounted at `/api/stripe/webhook` in `app.js` (before JSON parser) to preserve raw body for signature verification.

When changing Stripe behavior, ensure:

- Webhook secret is set and verified.
- `return_url` uses `{CHECKOUT_SESSION_ID}` for success redirect.

## PayPal Logic

- Order creation: `api/src/services/paypal.service.js` (`createOrder`).
- Capture/confirmation: `api/src/services/paypal.service.js` (`captureOrder`).
- API confirmation endpoint: `POST /api/apply/paypal/confirm` in `api/src/controllers/apply.controller.js`.

When changing PayPal behavior, ensure:

- `return_url` points to app success route.
- `cancel_url` points back to payment route.
- capture remains idempotent at controller level (already-paid orders return existing paid response).

## Changing the Apply Form

The apply form is in `app/src/components/apply/ApplicationForm.jsx` and `app/src/hooks/useApplicationForm.js`.

- Adding fields: add to form state, validation, FormData in `handleSubmit`, and API/DB/model.
- Removing fields: remove from all of the above and from `api/src/middleware/validate.js`.
- The submit flow is now provider-aware: form -> `POST /api/apply` -> API creates pending application + initializes provider -> frontend navigates to `/payment` with provider checkout details in state. Do not bypass this sequence.

## Success Page and Status Resolution

- Success page resolves payment from backend state:
  - Stripe via `GET /api/apply/status/:sessionId`
  - PayPal via `POST /api/apply/paypal/confirm`
- Keep backend as the source of truth; avoid local-only "paid" assumptions.

## Admin Dashboard Integration

- Dashboard uses API only (no seed fallback).
- Supports filters for `type`, `status`, and `provider`.
- Uses request timeout in admin API service.
- Shows explicit error/retry state and delete-in-progress state.

When changing admin data contracts:

- keep query params aligned with `api/src/controllers/admin.controller.js`
- keep provider/status labels consistent with backend enums

## File Storage (CVs)

- **Local dev:** CVs are stored on disk in `api/uploads/` when `BLOB_READ_WRITE_TOKEN` is not set.
- **Vercel:** CVs go to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set. Storage logic is in `api/src/services/storage.service.js`.

Do not mix storage backends for existing data; migration would require a script.

## TODO List

- [ ] Set up MongoDB database and user credentials for this project.
- [ ] Set `MONGODB_URI` in API `.env` and verify connection on API startup.
- [ ] Create PayPal developer app (sandbox first).
- [ ] Add `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` to API `.env`.
- [ ] Confirm `PAYPAL_API_BASE` points to sandbox in dev and live in production.
- [ ] Set `PAYMENT_PROVIDER=paypal` in API `.env`.
- [ ] Decide Stripe fallback policy and set `ENABLE_STRIPE_FALLBACK` accordingly.
- [ ] If Stripe fallback is enabled, set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
- [ ] Verify app success redirect and PayPal token capture end-to-end.
- [ ] Verify Stripe webhook endpoint is reachable and signed correctly.
- [ ] Run full integration test: submit -> payment -> success -> admin visibility.
- [ ] Add/refresh `.env.example` entries for all new payment/provider env vars.
- [ ] **CRITICAL:** Change PayPal currency back to `EUR` in `api/src/services/paypal.service.js` and `app/src/pages/Payment.jsx` before production deployment.
