const Order = require("../models/Order");
const User = require("../models/User");

const sendOrderStatusEmail = require("../utils/sendOrderStatusEmail");

const getOrdersByUserEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const orders = await Order.find({ userEmail: email }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ message: "Chyba při načítání objednávek." });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({ message: "Chyba při načítání všech objednávek." });
  }
};

const createOrder = async (req, res) => {
  try {
    const sendOrderEmail = require("../utils/sendEmail");
    const {
      userEmail,
      customerName,
      customerSurname,
      items,
      totalPrice,
      originalPrice,
      appliedDiscount,
      paymentMethodId,
      manualPayment,
      contact,
      address,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Košík je prázdný." });
    }

    if (!totalPrice) {
      return res.status(400).json({ message: "Chybí celková cena." });
    }

    const mappedItems = items.map((item) => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      customerName,
      customerSurname,
      userEmail,
      items: mappedItems,
      totalPrice,
      originalPrice: originalPrice || totalPrice,
      appliedDiscount: appliedDiscount || null,
      paymentMethodId: paymentMethodId || null,
      manualPayment: manualPayment || null,
      contact,
      address,
      status: "paid",
    });

    if (appliedDiscount?.code && userEmail) {
      const user = await User.findOne({ email: userEmail });

      if (user) {
        user.discounts = (user.discounts || []).map((discount) => {
          if (discount.code === appliedDiscount.code && !discount.isUsed) {
            return {
              ...discount.toObject(),
              isUsed: true,
            };
          }
          return discount;
        });

        await user.save();
      }
    }
    await sendOrderEmail(contact.email, order);

    res.status(201).json({
      message: "Objednávka byla úspěšně zaplacena.",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Chyba při vytváření objednávky." });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      deliveryEstimateDays,
      deliveryWindowStart,
      deliveryWindowEnd,
      sendEmail,
    } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Objednávka nebyla nalezena." });
    }

    order.status = status;
    order.deliveryEstimateDays = deliveryEstimateDays || null;
    order.deliveryWindowStart = deliveryWindowStart || "";
    order.deliveryWindowEnd = deliveryWindowEnd || "";

    await order.save();

    if (sendEmail && order.contact?.email) {
      await sendOrderStatusEmail(order.contact.email, order);
    }

    res.status(200).json({
      message: "Stav objednávky byl upraven.",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    res.status(500).json({ message: "Chyba při úpravě stavu objednávky." });
  }
};

module.exports = {
  createOrder,
  getOrdersByUserEmail,
  getAllOrders,
  updateOrderStatus,
};
