const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// připojení k MongoDB (lokálně)
mongoose
  .connect('mongodb://localhost:27017/mojedb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Připojeno k MongoDB'))
  .catch((err) => console.error('❌ Chyba připojení k MongoDB:', err));


app.get('/api/hello', (req, res) => {
  res.json({ message: 'Ahoj z backendu! 👋' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});