const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { auth } = require('../middleware/auth');
 
router.get('/:eventId', feedbackController.getEventFeedback);
router.post('/:eventId', auth, feedbackController.submitFeedback);

module.exports = router;
