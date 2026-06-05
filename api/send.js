import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // mail transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Website Message",
      text: message,
    });

    // Redirect user instead of sending JSON
    const redirectUrl = req.body._next || "/";
    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error("MAIL ERROR:", err);
    return res.redirect(302, req.body._next || "/?error=1");
  }
}
