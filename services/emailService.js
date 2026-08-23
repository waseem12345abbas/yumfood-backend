/**
 * Email Service — plug in Nodemailer / SendGrid / Resend as needed.
 *
 * To activate:
 *   npm install nodemailer
 *   Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to .env
 */

// const nodemailer = require('nodemailer');

/**
 * Send a generic email.
 * @param {object} options - { to, subject, html }
 */
const sendEmail = async ({ to, subject, html }) => {
  if (process.env.NODE_ENV !== 'production') {
    // In development just log — swap for real transport when ready
    console.log(`📧 [DEV EMAIL] To: ${to} | Subject: ${subject}`);
    return;
  }

  // Uncomment & configure for production:
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: Number(process.env.SMTP_PORT),
  //   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  // });
  // await transporter.sendMail({ from: `"YumFood" <${process.env.SMTP_USER}>`, to, subject, html });
};

/**
 * Welcome email sent after registration.
 */
const sendWelcomeEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: '🍕 Welcome to YumFood!',
    html: `
      <h1>Hi ${user.name}, welcome aboard!</h1>
      <p>You've successfully joined YumFood — the place where great stories live.</p>
      <p><a href="${process.env.CLIENT_URL}/write">Start writing your first article →</a></p>
    `,
  });

/**
 * Notify author when their post is approved.
 */
const sendPostApprovedEmail = (user, post) =>
  sendEmail({
    to: user.email,
    subject: '✅ Your article has been published!',
    html: `
      <h2>Great news, ${user.name}!</h2>
      <p>Your article "<strong>${post.title}</strong>" has been approved and is now live.</p>
      <p><a href="${process.env.CLIENT_URL}/blog/${post.slug}">Read it here →</a></p>
    `,
  });

module.exports = { sendEmail, sendWelcomeEmail, sendPostApprovedEmail };
