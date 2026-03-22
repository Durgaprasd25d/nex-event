const Message = require('../models/Message');

exports.getEventMessages = async (req, res) => {
  try {
    const messages = await Message.find({ event: req.params.eventId })
      .populate('user', 'name')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const newMessage = new Message({
      event: req.params.eventId,
      user: req.user.id,
      text
    });
    await newMessage.save();
    
    // Note: Socket emission is handled by the frontend after success 
    // or we could emit from here if we had access to IO.
    // For simplicity, we'll let the frontend emit to the socket.
    
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
