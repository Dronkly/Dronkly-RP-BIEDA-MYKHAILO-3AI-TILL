const Order = require('../models/Order');

const getOrdersByUserEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('GET ORDERS ERROR:', error);
    res.status(500).json({ message: 'Chyba při načítání objednávek.' });
  }
};
 
const createOrder = async (req, res) => {
  try {
    const {
      userEmail,
      items,
      totalPrice,
      paymentMethodId,
      manualPayment,
      contact,
      address,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Košík je prázdný.' });
    }

    if (!totalPrice) {
      return res.status(400).json({ message: 'Chybí celková cena.' });
    }

    const mappedItems = items.map((item) => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      userEmail,
      items: mappedItems,
      totalPrice,
      paymentMethodId: paymentMethodId || null,
      manualPayment: manualPayment || null,
      contact,
      address,
      status: 'paid',
    });

    res.status(201).json({
      message: 'Objednávka byla úspěšně zaplacena.',
      order,
    });
  } catch (error) {
    console.error('CREATE ORDER ERROR:', error);
    res.status(500).json({ message: 'Chyba při vytváření objednávky.' });
  }
};

module.exports = { createOrder, getOrdersByUserEmail };