const express = require('express');
const router = express.Router();
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getCategories, getSchedule } = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/categories', getCategories);
router.get('/schedule', getSchedule);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;
