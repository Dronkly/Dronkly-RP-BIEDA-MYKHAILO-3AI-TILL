const express = require("express");
const Stripe = require("stripe");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, customerEmail, discountCode, discountedTotalPrice } =
      req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Košík je prázdný." });
    }

    const normalTotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );

    const stripeTotal = discountedTotalPrice || normalTotal;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "cs",
      customer_email: customerEmail,
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "czk",
            product_data: {
              name: discountCode
                ? `Objednávka EkoModa se slevou ${discountCode}`
                : "Objednávka EkoModa",
            },
            unit_amount: Math.round(stripeTotal * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        discountCode: discountCode || "",
        originalTotal: normalTotal.toString(),
        paidTotal: stripeTotal.toString(),
      },

      success_url: `${process.env.FRONTEND_URL}/?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("STRIPE ERROR:", error);
    res.status(500).json({ message: "Nepodařilo se vytvořit platbu." });
  }
});

module.exports = router;
