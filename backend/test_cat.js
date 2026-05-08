const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const cats = await Category.find();
  console.log(cats);
  process.exit(0);
});
