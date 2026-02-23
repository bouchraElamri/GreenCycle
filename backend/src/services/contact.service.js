const sendEmail = require("../utils/email");

const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER_EMAIL || "greencycle686@gmail.com";

async function sendContactMessage({ name, email, phone, message }) {
  const subject = `New Contact Message - ${name}`;
  const text = [
    "You received a new message from the website contact form.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    "",
    "Message:",
    message,
  ].join("\n");

  await sendEmail(CONTACT_RECEIVER, subject, text);
}

module.exports = { sendContactMessage };
