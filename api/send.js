import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Debug environment variables
  console.log("========== MAIL DEBUG ==========");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
  console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length || 0);
  console.log("================================");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER?.trim(),
      pass: process.env.EMAIL_PASS?.trim(),
    },
  });

  try {
    // Test login first
    console.log("Verifying Gmail credentials...");

    await transporter.verify();

    console.log("✅ SMTP VERIFY SUCCESS");

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Website Message",
      text: message,
    });

    console.log("✅ EMAIL SENT");
    console.log("Message ID:", info.messageId);

    const redirectUrl = req.body._next || "/";
    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error("❌ MAIL ERROR");
    console.error("Code:", err.code);
    console.error("Command:", err.command);
    console.error("Response Code:", err.responseCode);
    console.error("Response:", err.response);
    console.error(err);

    return res.redirect(302, req.body._next || "/?error=1");
  }
}
