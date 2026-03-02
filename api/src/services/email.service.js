// Placeholder email service.
// Replace with Resend/EmailJS integration later.

async function sendPaymentConfirmation({ fullName, email, type, amount }) {
  console.log("[email] payment confirmation", { fullName, email, type, amount });
}

module.exports = { sendPaymentConfirmation };
