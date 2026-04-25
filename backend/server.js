const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const reviewRoutes = require("./routes/review");
const homeReviewRoutes = require("./routes/homeReview");
const stripeRoutes = require("./routes/stripe");



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/home-reviews", homeReviewRoutes);
app.use("/api/stripe", stripeRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Ahoj z backendu! 👋' });
});

const PORT = process.env.PORT || 5000;

console.log('MONGO_URI:', process.env.MONGO_URI ? 'načteno' : 'nenačteno');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'načteno' : 'nenačteno');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'načteno' : 'nenačteno');

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log('✅ Připojeno k MongoDB');

    app.listen(PORT, () => {
      console.log(`Server běží na http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Chyba připojení k MongoDB:', err.message);
  });

