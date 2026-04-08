const express = require('express');
const router = express.Router();
const regController = require('../controllers/registrationController');
const { auth, authorize } = require('../middleware/auth');

router.post('/:eventId', auth, regController.registerForEvent);
router.get('/my', auth, regController.getMyRegistrations);
router.get('/event/:eventId', auth, regController.getEventRegistrations);
router.post('/validate/:eventId', auth, authorize('admin'), regController.validateRegistration);
router.get('/:id/ticket', auth, regController.downloadTicket);

module.exports = router;
