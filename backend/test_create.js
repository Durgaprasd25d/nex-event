const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const admin = await User.findOne({ role: 'admin' });
  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
  const formData = new FormData();
  formData.append('title', 'Test Title');
  formData.append('description', 'Test Description');
  formData.append('category', new mongoose.Types.ObjectId().toString());
  formData.append('date', new Date().toISOString());
  formData.append('location', 'Cyber Hub');
  formData.append('capacity', '500');
  formData.append('rows', '10');
  formData.append('cols', '10');
  formData.append('entryCutoff', new Date().toISOString());
  formData.append('timeline', JSON.stringify([]));
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
