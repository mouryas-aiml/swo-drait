const express = require('express');
const router = express.Router();
const { registerForEvent, getMyRegistrations, cancelRegistration, getEventParticipants, exportParticipants, checkIn } = require('../controllers/registration.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.put('/:id/cancel', protect, cancelRegistration);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventParticipants);
router.get('/event/:eventId/export', protect, authorize('organizer', 'admin'), exportParticipants);
router.put('/:id/checkin', protect, authorize('organizer', 'admin'), checkIn);

module.exports = router;
