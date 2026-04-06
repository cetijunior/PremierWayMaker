// api/src/services/email.service.js
'use strict';

const nodemailer = require('nodemailer');
const env = require('../config/env');

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

function createTransport() {
  if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) {
    console.warn(
      '[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — emails will be logged only'
    );
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.GMAIL_USER,
      pass: env.GMAIL_APP_PASSWORD, // Gmail App Password (not account password)
    },
  });
}

let _transport = null;

function getTransport() {
  if (!_transport) _transport = createTransport();
  return _transport;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Tirane',
  }) + ' (Tirana time)';
}

function typeLabel(type) {
  return type === 'inside' ? 'Inside Albania' : 'Outside Albania';
}

// ---------------------------------------------------------------------------
// Email: Applicant Confirmation
// ---------------------------------------------------------------------------

/**
 * Sends a confirmation email to the applicant after successful payment.
 */
async function sendApplicationConfirmation({
  fullName,
  email,
  type,
  amount,
  bookingStart,
  bookingEnd,
}) {
  const transport = getTransport();
  const subject = 'Your Premier Way Maker Application is Confirmed ✓';

  const bookingBlock =
    bookingStart
      ? `
        <tr>
          <td style="padding:6px 0;color:#5A6A7A;font-size:14px;">Appointment</td>
          <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1B2A4A;">
            ${formatDate(bookingStart)}
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#5A6A7A;font-size:14px;">Duration</td>
          <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1B2A4A;">
            Until ${formatDate(bookingEnd)}
          </td>
        </tr>
      `
      : '';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F1EC;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EC;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1B2A4A 0%,#2E6B9E 100%);padding:32px 40px;text-align:center;">
            <p style="margin:0 0 8px;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Premier Way Maker</p>
            <h1 style="margin:0;color:#F5B731;font-size:24px;font-weight:700;">Application Confirmed!</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 24px;font-size:16px;color:#1B2A4A;">
              Hello <strong>${fullName}</strong>,
            </p>
            <p style="margin:0 0 28px;font-size:15px;color:#5A6A7A;line-height:1.6;">
              Great news — your payment was successful and your application has been received.
              Our team will review your CV and contact you shortly.
            </p>

            <!-- Summary box -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#F4F1EC;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
              <tr>
                <td style="padding:6px 0;color:#5A6A7A;font-size:14px;">Application type</td>
                <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1B2A4A;">${typeLabel(type)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#5A6A7A;font-size:14px;">Amount paid</td>
                <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1B2A4A;">€${amount}</td>
              </tr>
              ${bookingBlock}
            </table>

            <p style="margin:0 0 28px;font-size:14px;color:#5A6A7A;line-height:1.6;">
              If you have any questions, reach out to us on WhatsApp or email us at
              <a href="mailto:premierwaymaker@gmail.com" style="color:#2E6B9E;">premierwaymaker@gmail.com</a>.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#F5B731;border-radius:10px;">
                  <a href="https://wa.me/355693732177"
                    style="display:inline-block;padding:12px 28px;color:#1B2A4A;font-weight:700;font-size:15px;text-decoration:none;">
                    Contact Us on WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F4F1EC;padding:20px 40px;text-align:center;border-top:1px solid #E8E5E0;">
            <p style="margin:0;font-size:12px;color:#5A6A7A;">
              © ${new Date().getFullYear()} Premier Way Maker · Rruga Egnatia, Durrës, Albania
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `
Hello ${fullName},

Your Premier Way Maker application is confirmed!

Application Type: ${typeLabel(type)}
Amount Paid: €${amount}
${bookingStart ? `Appointment: ${formatDate(bookingStart)}` : ''}

Our team will review your CV and contact you shortly.

Questions? Email premierwaymaker@gmail.com or WhatsApp +355 69 373 2177.

© ${new Date().getFullYear()} Premier Way Maker
`.trim();

  if (!transport) {
    console.log(`[email] Would send confirmation to ${email}:\n${text}`);
    return;
  }

  await transport.sendMail({
    from: `"Premier Way Maker" <${env.GMAIL_USER}>`,
    to: email,
    subject,
    html,
    text,
  });

  console.log(`[email] Confirmation sent to ${email}`);
}

// ---------------------------------------------------------------------------
// Email: Admin Notification
// ---------------------------------------------------------------------------

/**
 * Sends an internal alert to the admin Gmail when a new paid application arrives.
 */
async function sendAdminNotification({
  fullName,
  email,
  phone,
  type,
  amount,
  bookingStart,
  bookingEnd,
  applicationId,
}) {
  const transport = getTransport();
  const subject = `💼 New Paid Application — ${fullName} (${typeLabel(type)})`;
  const adminUrl = env.ADMIN_URL || 'https://premierwaymaker.com/admin';

  const bookingRow =
    bookingStart
      ? `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;color:#5A6A7A;font-size:13px;width:130px;">Appointment</td>
          <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;font-size:13px;font-weight:600;color:#1B2A4A;">
            ${formatDate(bookingStart)} → ${formatDate(bookingEnd)}
          </td>
        </tr>
      `
      : '';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F4F1EC;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EC;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr>
          <td style="background:#1B2A4A;padding:24px 32px;">
            <p style="margin:0;color:#F5B731;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Admin Alert</p>
            <h2 style="margin:8px 0 0;color:#ffffff;font-size:20px;">New Paid Application</h2>
          </td>
        </tr>

        <!-- Details table -->
        <tr>
          <td style="padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="border:1px solid #E8E5E0;border-radius:10px;overflow:hidden;">
              <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;background:#F9F8F6;color:#5A6A7A;font-size:13px;width:130px;">Name</td>
                <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;background:#F9F8F6;font-size:13px;font-weight:600;color:#1B2A4A;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;color:#5A6A7A;font-size:13px;">Email</td>
                <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;font-size:13px;">
                  <a href="mailto:${email}" style="color:#2E6B9E;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;background:#F9F8F6;color:#5A6A7A;font-size:13px;">Phone</td>
                <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;background:#F9F8F6;font-size:13px;">
                  <a href="tel:${phone}" style="color:#2E6B9E;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;color:#5A6A7A;font-size:13px;">Type</td>
                <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;font-size:13px;font-weight:600;color:#1B2A4A;">${typeLabel(type)}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;background:#F9F8F6;color:#5A6A7A;font-size:13px;">Amount</td>
                <td style="padding:8px 12px;border-bottom:1px solid #E8E5E0;background:#F9F8F6;font-size:13px;font-weight:700;color:#1B2A4A;">€${amount}</td>
              </tr>
              ${bookingRow}
              <tr>
                <td style="padding:8px 12px;color:#5A6A7A;font-size:13px;">App ID</td>
                <td style="padding:8px 12px;font-size:11px;font-family:monospace;color:#5A6A7A;">${applicationId}</td>
              </tr>
            </table>

            <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td style="background:#2E6B9E;border-radius:10px;">
                  <a href="${adminUrl}/dashboard"
                    style="display:inline-block;padding:12px 28px;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;">
                    Open Admin Dashboard →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#F4F1EC;padding:16px 32px;text-align:center;border-top:1px solid #E8E5E0;">
            <p style="margin:0;font-size:11px;color:#5A6A7A;">Premier Way Maker — Internal Notification</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `
NEW PAID APPLICATION — ${fullName}

Name:      ${fullName}
Email:     ${email}
Phone:     ${phone}
Type:      ${typeLabel(type)}
Amount:    €${amount}
${bookingStart ? `Booking:   ${formatDate(bookingStart)} → ${formatDate(bookingEnd)}` : ''}
App ID:    ${applicationId}

Dashboard: ${adminUrl}/dashboard
`.trim();

  if (!transport) {
    console.log(`[email] Would send admin notification:\n${text}`);
    return;
  }

  await transport.sendMail({
    from: `"Premier Way Maker" <${env.GMAIL_USER}>`,
    to: env.GMAIL_USER, // Send to the same Gmail (admin inbox)
    replyTo: email,      // Reply goes directly to the applicant
    subject,
    html,
    text,
  });

  console.log(`[email] Admin notification sent for application ${applicationId}`);
}

module.exports = { sendApplicationConfirmation, sendAdminNotification };
