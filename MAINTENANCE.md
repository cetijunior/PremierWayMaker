# Maintenance Guide

How to make changes safely without breaking the application.

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

## Adding a New Environment Variable

1. Add to `.env.example` with a brief comment.
2. Add to `api/src/config/env.js` if the API needs it.
3. For app build-time vars (Vite), use `VITE_` prefix and add to `.env.example`.
4. If required in production, add to `REQUIRED_IN_PRODUCTION` in `api/src/config/env.js`.

## Changing Application Types or Prices

Prices are centralized in `api/src/constants/pricing.js`:
- `PRICES_CENTS`: { inside: 5000, outside: 30000 }
- `PRICES_EUROS`: { inside: 50, outside: 300 }

To add or change a type:
1. Update `api/src/constants/pricing.js`.
2. Update `api/src/models/Application.model.js` enum for `type` if needed.
3. Update `app/src/constants/services.js` `APPLICATION_TYPES` (display labels and prices).
4. Update `app/src/i18n/locales/*.json` for any new labels.
5. Update `api/src/middleware/validate.js` if the `type` enum changes.
6. Update Stripe product name in `api/src/services/stripe.service.js` if type labels change.

## Stripe and Webhook Logic

- **Checkout:** `api/src/services/stripe.service.js` — `createCheckoutSession` creates embedded sessions.
- **Webhook:** `api/src/controllers/webhook.controller.js` — handles `checkout.session.completed`, updates `paymentStatus`, sends email.
- **Route:** Webhook is mounted at `/api/stripe/webhook` in `app.js` (before JSON parser) to preserve raw body for signature verification.

When changing Stripe behavior, ensure:
- Webhook secret is set and verified.
- `return_url` uses `{CHECKOUT_SESSION_ID}` for success redirect.

## Changing the Apply Form

The apply form is in `app/src/components/apply/ApplicationForm.jsx` and `app/src/hooks/useApplicationForm.js`.

- Adding fields: add to form state, validation, FormData in `handleSubmit`, and API/DB/model.
- Removing fields: remove from all of the above and from `api/src/middleware/validate.js`.
- The submit flow: form → `POST /api/apply` → API creates Application + Stripe session → returns `clientSecret` → frontend navigates to `/payment` with `clientSecret` in state. Do not break this sequence.

## File Storage (CVs)

- **Local dev:** CVs are stored on disk in `api/uploads/` when `BLOB_READ_WRITE_TOKEN` is not set.
- **Vercel:** CVs go to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set. Storage logic is in `api/src/services/storage.service.js`.

Do not mix storage backends for existing data; migration would require a script.
