const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user.js');
const authRoute = require('./routes/auth.js');
const productRoute = require('./routes/products');
const orderRoute = require('./routes/order');
const cartRoute = require('./routes/cart');

app.use(express.json());
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/cart', cartRoute);

app.listen(process.env.PORT_NUMBER, () => {
  console.log('Server running on port ' + process.env.PORT_NUMBER);
});
