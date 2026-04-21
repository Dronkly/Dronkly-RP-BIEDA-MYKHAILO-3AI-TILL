const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderEmail = async (to, order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}×</td>
        <td>${item.price * item.quantity} Kč</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <div style="font-family: Arial; background:#f6f6f6; padding:20px;">
      <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:20px;">
        
        <h2 style="color:#2f5d50;">Děkujeme za objednávku 🌿</h2>
        
        <p>Vaše objednávka byla úspěšně přijata a bude odeslána v nejbližší době.</p>

        <h3>📦 Shrnutí objednávky</h3>

        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid #ddd;">
              <th align="left">Produkt</th>
              <th>Ks</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <hr />

        <h3>💰 Celkem: ${order.totalPrice} Kč</h3>

        <p style="margin-top:20px;">S pozdravem,<br><strong>EkoModa</strong></p>

      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"EkoModa" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Potvrzení objednávky',
    html,
  });
};

module.exports = sendOrderEmail;