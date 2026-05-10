# Production Deployment & Integration Guide

This application is currently configured for a local, zero-dependency environment. Below are the steps required to transition the mock/stubbed services to robust, production-ready third-party integrations.

## 1. Authentication & JWT Rotation
Currently, local JWT keys are used and defined in `.env`.
- **Action**: Replace `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in the production environment variables with high-entropy cryptographic keys (e.g., generated via `openssl rand -base64 32`).
- **OAuth/SSO**: In `backend/src/controllers/auth.controller.js`, look for `// TODO: Replace with production JWT signing & external OAuth/SSO`. Implement standard OAuth2 flow (Google/Microsoft) using Passport.js or equivalent libraries if SSO is required.

## 2. Payment Gateway Integration
Currently, payments are verified using a deterministic local mock (`verifyPaymentGateway` in the services directory).
- **Action**: Locate `// TODO: Replace with Stripe/Razorpay/PayPal SDK`. 
- **Implementation**: 
  1. Install your gateway's Node SDK (e.g., `npm i stripe` or `npm i razorpay`).
  2. Map the incoming payload to the provider’s order creation API.
  3. Set up a Webhook endpoint in Express (`express.raw()`) to listen for real-time payment success/failure events.
  4. Update the database securely only when the webhook event signature is valid.

## 3. Email & SMS Notifications
Currently, receipts and pending reminders are outputted via `console.log()` stubs.
- **Action**: Locate `// TODO: Integrate SendGrid/Twilio/Resend`.
- **Implementation**:
  1. For Emails: Integrate SendGrid, NodeMailer (with an SMTP service), or Resend to send PDF receipts directly to the `student.email`.
  2. For SMS: Integrate Twilio or an equivalent regional SMS API. Trigger texts on payment success or pending due date approaches.
  3. Ensure failure retries using a worker queue (e.g., BullMQ) so API failures don't block main threads.

## 4. File & Cloud Storage
Currently, file uploads (profile pictures and generated PDF receipts) use the local `uploads/` directory.
- **Action**: Locate `// TODO: Replace with AWS S3/Cloudinary`.
- **Implementation**:
  1. Setup an AWS S3 bucket or Cloudinary account.
  2. Update `backend/src/middlewares/upload.middleware.js` to use `multer-s3` or similar memory storage.
  3. Make sure to serve file URLs via a CDN rather than through your Node server.

## 5. Security & Rate Limiting
- **CORS**: Restrict the `CORS_ORIGIN` in the `.env` strictly to the production frontend domain instead of `*` or `localhost`.
- **Rate Limiting**: The current rate limiting is basic. Enhance `backend/src/app.js` using `express-rate-limit` connected to a Redis instance for distributed scaling.
- **Helmet**: Already included, but ensure SSL/HTTPS is enforced in the load balancer (Nginx/AWS ALB) so HSTS is strictly respected.
- **Monitoring**: Add APM tools like New Relic, Datadog, or Sentry to track runtime errors and unhandled promise rejections properly instead of relying purely on Winston logs.

## 6. Database Migrations
- The current method of raw SQL files is acceptable for bootstrapping, but in production, adopt a migration tool like `db-migrate`, `Knex.js migrations`, or Prisma for stateful and reversible database changes.
