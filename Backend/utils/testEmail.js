// utils/testEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// =======================
// CONFIGURATION CHECK
// =======================
function checkConfiguration() {
  console.log("\n🔍 Checking email configuration...\n");

  const config = {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS ? "***" + process.env.EMAIL_PASS.slice(-4) : undefined,
    FRONTEND_URL: process.env.FRONTEND_URL,
  };

  console.log("Configuration:");
  console.table(config);

  const issues = [];
  if (!process.env.EMAIL_USER) issues.push("❌ EMAIL_USER is not set");
  if (!process.env.EMAIL_PASS) issues.push("❌ EMAIL_PASS is not set");

  if (issues.length > 0) {
    console.error("\n⚠️  Configuration Issues:");
    issues.forEach((issue) => console.error(issue));
    console.error("\n💡 Make sure your .env file contains:");
    console.error("EMAIL_USER=your-email@gmail.com");
    console.error("EMAIL_PASS=your-app-specific-password\n");
    return false;
  }

  console.log("✅ Configuration looks good!\n");
  return true;
}

// =======================
// TRANSPORTER VERIFICATION
// =======================
async function verifyTransporter(transporter) {
  console.log("🔌 Verifying connection to email server...\n");

  try {
    await transporter.verify();
    console.log("✅ Successfully connected to Gmail SMTP server\n");
    return true;
  } catch (error) {
    console.error("❌ Connection verification failed:", error.message);
    console.error("\n💡 Common issues:");
    console.error("  1. App Password not generated (required for Gmail)");
    console.error("  2. 2-Factor Authentication not enabled on Gmail");
    console.error("  3. Incorrect email or password");
    console.error("  4. Firewall blocking SMTP port (587/465)");
    console.error("\n📖 To generate Gmail App Password:");
    console.error("  1. Enable 2FA: https://myaccount.google.com/security");
    console.error("  2. Generate App Password: https://myaccount.google.com/apppasswords");
    console.error("  3. Use the 16-character password in your .env file\n");
    return false;
  }
}

// =======================
// SEND TEST EMAIL
// =======================
async function sendTestEmail() {
  console.log("═══════════════════════════════════════");
  console.log("   InternConnect Email Test Utility");
  console.log("═══════════════════════════════════════\n");

  // Step 1: Check configuration
  if (!checkConfiguration()) {
    process.exit(1);
  }

  // Step 2: Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Additional options for better reliability
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5,
  });

  // Step 3: Verify connection
  const isConnected = await verifyTransporter(transporter);
  if (!isConnected) {
    transporter.close();
    process.exit(1);
  }

  // Step 4: Send test email
  console.log("📧 Sending test email...\n");

  try {
    const testRecipient = process.env.TEST_EMAIL || process.env.EMAIL_USER;
    const timestamp = new Date().toLocaleString();
    const messageIdPlaceholder = `<${Date.now()}.${Math.random().toString(36).substring(2)}@internconnect.test>`;

    const info = await transporter.sendMail({
      from: `"InternConnect Test" <${process.env.EMAIL_USER}>`,
      to: testRecipient,
      subject: `✅ InternConnect Email Test - ${timestamp}`,
      text: `
Hello!

This is a test email from InternConnect to verify your email configuration.

✅ If you're reading this, your email service is working correctly!

Test Details:
- Sent at: ${timestamp}
- From: ${process.env.EMAIL_USER}
- To: ${testRecipient}
- Message ID: (See details below)

Next Steps:
1. Try sending verification emails
2. Test password reset emails
3. Check spam folder if emails don't arrive

---
InternConnect Email Service
      `.trim(),
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: #6c63ff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 5px 5px; }
            .success { color: #22c55e; font-size: 24px; }
            .info-box { background: #f0f0f0; padding: 15px; border-left: 4px solid #6c63ff; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>InternConnect Email Test</h1>
            </div>
            <div class="content">
              <p class="success">✅ Success!</p>
              <p>This is a test email from InternConnect to verify your email configuration.</p>
              <p><strong>If you're reading this, your email service is working correctly!</strong></p>
              
              <div class="info-box">
                <strong>Test Details:</strong>
                <ul>
                  <li>Sent at: ${timestamp}</li>
                  <li>From: ${process.env.EMAIL_USER}</li>
                  <li>To: ${testRecipient}</li>
                  <li>Message ID: ${messageIdPlaceholder}</li>
                </ul>
              </div>

              <h3>Next Steps:</h3>
              <ol>
                <li>Try sending verification emails</li>
                <li>Test password reset emails</li>
                <li>Check spam folder if emails don't arrive</li>
              </ol>
            </div>
            <div class="footer">
              <p>InternConnect Email Service - Test Message</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("═══════════════════════════════════════");
    console.log("✅ TEST EMAIL SENT SUCCESSFULLY!");
    console.log("═══════════════════════════════════════\n");
    console.log("Details:");
    console.log(`  Message ID: ${info.messageId}`);
    console.log(`  Response: ${info.response}`);
    console.log(`  Recipient: ${testRecipient}`);
    console.log(`  Accepted: ${info.accepted.join(", ")}`);
    if (info.rejected.length > 0) {
      console.log(`  Rejected: ${info.rejected.join(", ")}`);
    }
    console.log("\n💡 Check your inbox (and spam folder) for the test email\n");
  } catch (error) {
    console.error("═══════════════════════════════════════");
    console.error("❌ FAILED TO SEND TEST EMAIL");
    console.error("═══════════════════════════════════════\n");
    console.error("Error details:");
    console.error(`  Type: ${error.name}`);
    console.error(`  Message: ${error.message}`);

    if (error.code) {
      console.error(`  Code: ${error.code}`);
    }

    console.error("\n💡 Troubleshooting tips:");

    if (error.message.includes("Invalid login")) {
      console.error("  • Double-check your EMAIL_USER and EMAIL_PASS");
      console.error("  • Make sure you're using an App Password, not your Gmail password");
      console.error("  • Verify 2FA is enabled on your Google account");
    } else if (error.message.includes("ECONNECTION") || error.message.includes("ETIMEDOUT")) {
      console.error("  • Check your internet connection");
      console.error("  • Verify firewall isn't blocking SMTP ports (587, 465)");
      console.error("  • Try disabling VPN if you're using one");
    } else if (error.message.includes("Recipient")) {
      console.error("  • Check that the recipient email address is valid");
    } else {
      console.error("  • Review the error message above");
      console.error("  • Check Gmail's error logs");
      console.error("  • Ensure you haven't exceeded Gmail's sending limits");
    }

    console.error("\n📖 Full error:");
    console.error(error);
    console.error();

    transporter.close();
    process.exit(1);
  }

  // Clean up
  transporter.close();
  console.log("🔒 Connection closed\n");
  process.exit(0);
}

// Run the test
sendTestEmail();
