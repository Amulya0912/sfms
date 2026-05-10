/**
 * Mock External Services
 * All stubs for local development — zero external network calls
 */

/**
 * Mock Payment Gateway Verification
 * Simulates payment verification from Stripe/Razorpay/PayPal
 *
 * // TODO: PRODUCTION INTEGRATION
 * // Replace with actual payment gateway SDK:
 * // - Stripe: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
 * //   const paymentIntent = await stripe.paymentIntents.retrieve(txnId);
 * // - Razorpay: const Razorpay = require('razorpay');
 * //   const instance = new Razorpay({ key_id, key_secret });
 * //   const payment = await instance.payments.fetch(txnId);
 * // - PayPal: Use @paypal/checkout-server-sdk
 *
 * @param {string} txnId - Transaction reference ID
 * @param {number} amount - Payment amount to verify
 * @returns {{ status: string, gatewayRef: string, verifiedAt: string }}
 */
const verifyPaymentGateway = async (txnId, amount) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    status: 'SUCCESS',
    gatewayRef: `MOCK_${Date.now()}`,
    verifiedAt: new Date().toISOString(),
    amount,
    txnId,
  };
};

/**
 * Mock Email Notification Service
 *
 * // TODO: PRODUCTION INTEGRATION
 * // Replace with SendGrid/Resend/Nodemailer:
 * // - SendGrid: const sgMail = require('@sendgrid/mail');
 * //   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 * //   await sgMail.send({ to, from, subject, html });
 * // - Resend: const { Resend } = require('resend');
 * //   const resend = new Resend(process.env.RESEND_API_KEY);
 * //   await resend.emails.send({ from, to, subject, html });
 *
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} body - Email body (HTML)
 * @returns {{ success: boolean, messageId: string }}
 */
const sendEmail = async (to, subject, body) => {
  console.log(`📧 [MOCK EMAIL] To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Body: ${body.substring(0, 100)}...`);

  return {
    success: true,
    messageId: `MOCK_EMAIL_${Date.now()}`,
  };
};

/**
 * Mock SMS Notification Service
 *
 * // TODO: PRODUCTION INTEGRATION
 * // Replace with Twilio/AWS SNS:
 * // - Twilio: const twilio = require('twilio')(accountSid, authToken);
 * //   await twilio.messages.create({ body, from, to });
 * // - AWS SNS: const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
 *
 * @param {string} phone - Recipient phone number
 * @param {string} message - SMS message
 * @returns {{ success: boolean, messageId: string }}
 */
const sendSMS = async (phone, message) => {
  console.log(`📱 [MOCK SMS] To: ${phone}`);
  console.log(`   Message: ${message}`);

  return {
    success: true,
    messageId: `MOCK_SMS_${Date.now()}`,
  };
};

/**
 * Mock File Upload to Cloud Storage
 *
 * // TODO: PRODUCTION INTEGRATION
 * // Replace with AWS S3/Cloudinary:
 * // - S3: const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
 * // - Cloudinary: const cloudinary = require('cloudinary').v2;
 * //   cloudinary.config({ cloud_name, api_key, api_secret });
 * //   const result = await cloudinary.uploader.upload(filePath);
 *
 * @param {string} filePath - Local file path
 * @param {string} folder - Target folder
 * @returns {{ url: string, key: string }}
 */
const uploadToCloud = async (filePath, folder = 'uploads') => {
  console.log(`☁️ [MOCK CLOUD UPLOAD] File: ${filePath} → ${folder}`);

  return {
    url: `http://localhost:5000/${folder}/${filePath.split('/').pop()}`,
    key: `${folder}/${filePath.split('/').pop()}`,
  };
};

module.exports = {
  verifyPaymentGateway,
  sendEmail,
  sendSMS,
  uploadToCloud,
};
