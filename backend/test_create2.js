const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Category = require('./models/Category');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.log("No admin found");
    process.exit(1);
  }
  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
  let cat = await Category.findOne();
  if (!cat) {
    cat = await Category.create({ name: 'Test Cat', description: 'Test Cat' });
  }

  const formData = new FormData();
  formData.append('title', 'Neon Nights Rooftop Gathering');
  formData.append('description', 'Detail the event atmosphere...');
  formData.append('category', cat._id.toString());
  formData.append('date', '2026-05-15T18:00');
  formData.append('location', 'Cyber Hub');
  formData.append('capacity', '500');
  formData.append('rows', '10');
  formData.append('cols', '10');
  formData.append('entryCutoff', '2026-05-15T19:00');
  formData.append('timeline', JSON.stringify([{time: '18:00', activity: 'Doors Open'}]));
  formData.append('tags[]', 'TEST');

  try {
    const res = await fetch('http://127.0.0.1:5000/api/events', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await res.json();
    console.log(res.status, data);
  } catch(e) {
    console.log("Error:", e.message);
  }
  process.exit(0);
});
