const contactService = require("../services/contact.service");

async function sendContact(req, res, next) {
  try {
    await contactService.sendContactMessage(req.body);
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    return next(error);
  }
}

module.exports = { sendContact };
