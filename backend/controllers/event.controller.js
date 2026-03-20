const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc  Get all events (with filters)
// @route GET /api/events
exports.getEvents = async (req, res, next) => {
  try {
    const { fest, category, search, page = 1, limit = 20, featured } = req.query;
    const query = { isActive: true };
    if (fest && fest !== 'Both') query.festName = fest;
    if (category) query.category = category;
    if (featured) query.isFeatured = true;
    if (search) query.title = { $regex: search, $options: 'i' };

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ isFeatured: -1, date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, count: events.length, total, page: Number(page), events });
  } catch (err) { next(err); }
};

// @desc  Get single event
// @route GET /api/events/:id
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event || !event.isActive) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) { next(err); }
};

// @desc  Create event
// @route POST /api/events
exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, event });
  } catch (err) { next(err); }
};

// @desc  Update event
// @route PUT /api/events/:id
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, event: updated });
  } catch (err) { next(err); }
};

// @desc  Delete event
// @route DELETE /api/events/:id
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    await Event.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) { next(err); }
};

// @desc  Get event categories
// @route GET /api/events/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Event.distinct('category', { isActive: true });
    res.json({ success: true, categories });
  } catch (err) { next(err); }
};

// @desc  Get schedule (grouped by day)
// @route GET /api/events/schedule
exports.getSchedule = async (req, res, next) => {
  try {
    const { festName } = req.query;
    const query = { isActive: true };
    if (festName && festName !== 'Both') query.festName = festName;
    const events = await Event.find(query).sort({ day: 1, startTime: 1 });
    const schedule = { 1: [], 2: [], 3: [] };
    events.forEach(e => { if (schedule[e.day]) schedule[e.day].push(e); });
    res.json({ success: true, schedule });
  } catch (err) { next(err); }
};
