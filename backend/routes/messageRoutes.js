const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');
 
router.get('/:eventId', auth, messageController.getEventMessages);
router.post('/:eventId', auth, messageController.postMessage);

module.exports = router;
