// Sends a test email through Resend to check the email configuration.
// Usage: npm run test-email -- you@example.com
import "dotenv/config";
import { sendMail } from "./email.js";

const recipient = process.argv[2]?.trim() || process.env.TEST_EMAIL;

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is not set in Backend/.env");
  process.exit(1);
}

if (!recipient) {
  console.error("Usage: npm run test-email -- <recipient-email>");
  process.exit(1);
}

console.log(`📧 Sending test email to ${recipient}…`);
console.log(
  `   From: ${process.env.EMAIL_FROM || "InternConnect <onboarding@resend.dev> (Resend test sender)"}`
);

try {
  const { messageId } = await sendMail({
    to: recipient,
    subject: "InternConnect email test",
    html: `
      <h2>✅ It works!</h2>
      <p>If you're reading this, InternConnect can send emails through Resend.</p>
      <p style="color: #64748b;">Sent at ${new Date().toLocaleString()}</p>
    `,
    text: "It works! InternConnect can send emails through Resend.",
  });

  console.log(`✅ Test email sent (id: ${messageId}). Check the inbox and spam folder.`);
} catch (error) {
  console.error(`❌ Failed to send test email: ${error.message}`);
  if (/testing emails|verify a domain/i.test(error.message)) {
    console.error(
      "💡 The Resend test sender only delivers to your own Resend account email.\n" +
        "   Send to that address, or verify a domain in Resend and set EMAIL_FROM."
    );
  }
  process.exit(1);
}
