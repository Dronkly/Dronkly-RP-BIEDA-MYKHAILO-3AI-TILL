const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const statusLabels = {
  paid: 'Zaplaceno',
  processing: 'Připravujeme',
  shipped: 'Na cestě',
  out_for_delivery: 'Doručujeme dnes',
  delivered: 'Doručeno',
  cancelled: 'Zrušeno',
};

const getStatusMessage = (order) => {
  if (order.status === 'shipped' && order.deliveryEstimateDays) {
    return `Vaše objednávka byla odeslána a dorazí přibližně za ${order.deliveryEstimateDays} dní.`;
  }

  if (
    order.status === 'out_for_delivery' &&
    order.deliveryWindowStart &&
    order.deliveryWindowEnd
  ) {
    return `Vaše objednávka dorazí dnes mezi ${order.deliveryWindowStart} a ${order.deliveryWindowEnd}.`;
  }

  if (order.status === 'processing') {
    return 'Vaši objednávku právě připravujeme k odeslání.';
  }

  if (order.status === 'delivered') {
    return 'Vaše objednávka byla doručena.';
  }

  return `Stav objednávky byl změněn na ${statusLabels[order.status]}`;
};

const sendOrderStatusEmail = async (to, order) => {
  const html = `
    <div style="font-family: Arial; background:#f6f6f6; padding:20px;">
      <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:20px;">
        
        <h2 style="color:#2f5d50;">📦 Aktualizace objednávky</h2>
        
        <p>${getStatusMessage(order)}</p>

        <div style="margin-top:20px; padding:15px; background:#f1f1f1; border-radius:8px;">
          <strong>Stav:</strong> ${statusLabels[order.status]}<br>
          <strong>Celkem:</strong> ${order.totalPrice} Kč
        </div>

        <p style="margin-top:20px;">Děkujeme za nákup ❤️<br><strong>EkoModa</strong></p>

      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"EkoModa" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Aktualizace objednávky',
    html,
  });
};

module.exports = sendOrderStatusEmail;