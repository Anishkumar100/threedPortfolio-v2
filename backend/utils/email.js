import nodemailer from 'nodemailer';
import logger from './logger.js';

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    logger.warn('SMTP not configured — emails will be logged but not sent.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const baseTemplate = (title, bodyHTML) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background: #0a0a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
    .card { background: #1c1c21; border-radius: 12px; padding: 32px; border: 1px solid #282732; }
    .accent { color: #52aeff; }
    .text { color: #839cb5; font-size: 14px; line-height: 1.7; }
    .heading { color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em; }
    .label { color: #839cb5; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin: 16px 0 4px; }
    .value { color: #ffffff; font-size: 14px; margin: 0 0 12px; }
    .divider { height: 1px; background: #282732; margin: 20px 0; }
    .footer { text-align: center; color: #4a5568; font-size: 11px; padding-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      ${bodyHTML}
    </div>
    <div class="footer">Portfolio Backend · Automated notification</div>
  </div>
</body>
</html>
`;

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  if (!transporter) {
    logger.info(`Email (not sent — no SMTP): to=${to}, subject=${subject}`);
    return { sent: false, reason: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Portfolio" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent: ${info.messageId} to ${to}`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    logger.error(`Email failed: ${err.message}`, { to, subject });
    return { sent: false, reason: err.message };
  }
};

export const sendInquiryNotification = async (inquiry) => {
  const html = baseTemplate(
    'New Service Inquiry',
    `
    <p class="heading">New Service Inquiry <span class="accent">✦</span></p>
    <p class="text">You have a new inquiry from your portfolio.</p>
    <div class="divider"></div>
    <p class="label">Name</p>
    <p class="value">${inquiry.name}</p>
    <p class="label">Email</p>
    <p class="value">${inquiry.email}</p>
    ${inquiry.phone ? `<p class="label">Phone</p><p class="value">${inquiry.phone}</p>` : ''}
    <p class="label">Service</p>
    <p class="value">${inquiry.serviceName || 'General'}</p>
    <p class="label">Budget</p>
    <p class="value">${inquiry.budget || 'Not specified'}</p>
    <p class="label">Timeline</p>
    <p class="value">${inquiry.timeline || 'Not specified'}</p>
    <div class="divider"></div>
    <p class="label">Message</p>
    <p class="text">${inquiry.message}</p>
    `
  );

  return sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@example.com',
    subject: `New Inquiry: ${inquiry.serviceName || 'General'} — ${inquiry.name}`,
    html,
  });
};

export const sendContactNotification = async (contact) => {
  const html = baseTemplate(
    'New Contact Message',
    `
    <p class="heading">New Contact Message <span class="accent">✦</span></p>
    <p class="text">Someone reached out through your portfolio contact form.</p>
    <div class="divider"></div>
    <p class="label">Name</p>
    <p class="value">${contact.name}</p>
    <p class="label">Email</p>
    <p class="value">${contact.email}</p>
    ${contact.subject ? `<p class="label">Subject</p><p class="value">${contact.subject}</p>` : ''}
    <div class="divider"></div>
    <p class="label">Message</p>
    <p class="text">${contact.message}</p>
    `
  );

  return sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@example.com',
    subject: `Contact: ${contact.subject || 'New message'} — ${contact.name}`,
    html,
  });
};

export const sendContactAutoReply = async (contact) => {
  const html = baseTemplate(
    'Thanks for reaching out!',
    `
    <p class="heading">Thanks, ${contact.name}! <span class="accent">✦</span></p>
    <p class="text">I've received your message and will get back to you within 24 hours.</p>
    <div class="divider"></div>
    <p class="text" style="font-style: italic;">Your message: "${contact.message.substring(0, 200)}${contact.message.length > 200 ? '...' : ''}"</p>
    <div class="divider"></div>
    <p class="text">In the meantime, feel free to check out my latest work at my portfolio.</p>
    <p class="text">Best regards,<br/><span class="accent" style="font-weight:700;">Anish Kumar</span></p>
    `
  );

  return sendEmail({
    to: contact.email,
    subject: "Thanks for reaching out! I'll reply soon.",
    html,
  });
};

export const sendMaintenanceAlert = async ({ isEnabled, message, estimatedEnd }) => {
  const status = isEnabled ? 'ENABLED' : 'DISABLED';
  const html = baseTemplate(
    `Maintenance Mode ${status}`,
    `
    <p class="heading">Maintenance Mode ${status} <span class="accent">⚙</span></p>
    <p class="text">Maintenance mode has been <strong>${status.toLowerCase()}</strong>.</p>
    <div class="divider"></div>
    <p class="label">Message</p>
    <p class="value">${message || 'N/A'}</p>
    <p class="label">Estimated End</p>
    <p class="value">${estimatedEnd ? new Date(estimatedEnd).toISOString() : 'Not set'}</p>
    `
  );

  return sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@example.com',
    subject: `Maintenance Mode ${status}`,
    html,
  });
};
