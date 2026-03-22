const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { auth, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/', auth, authorize('admin'), upload.single('image'), eventController.createEvent);
router.put('/:id', auth, authorize('admin'), eventController.updateEvent);
router.delete('/:id', auth, authorize('admin'), eventController.deleteEvent);

module.exports = router;
