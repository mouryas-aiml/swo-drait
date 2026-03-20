const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { sendRegistrationEmail } = require('../utils/emailService');
const { Parser } = require('json2csv');

// @desc  Register for event
// @route POST /api/registrations
exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId, participationType, teamName, teamMembers } = req.body;
    const event = await Event.findById(eventId);
    if (!event || !event.isActive) return res.status(404).json({ success: false, message: 'Event not found' });

    const existing = await Registration.findOne({ event: eventId, user: req.user._id, status: { $ne: 'cancelled' } });
    if (existing) return res.status(400).json({ success: false, message: 'Already registered for this event' });

    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Event is full!' });
    }

    const registration = await Registration.create({
      event: eventId,
      user: req.user._id,
      participationType,
      teamName,
      teamMembers: participationType === 'group' ? teamMembers : [],
    });

    await Event.findByIdAndUpdate(eventId, { $inc: { currentParticipants: 1 } });
    await registration.populate(['event', 'user']);

    // Send confirmation email (non-blocking)
    sendRegistrationEmail(req.user.email, registration).catch(console.error);

    res.status(201).json({ success: true, registration });
  } catch (err) { next(err); }
};

// @desc  Get my registrations
// @route GET /api/registrations/my
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id, status: { $ne: 'cancelled' } })
      .populate('event', 'title festName category date startTime venue image')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: registrations.length, registrations });
  } catch (err) { next(err); }
};

// @desc  Cancel registration
// @route PUT /api/registrations/:id/cancel
exports.cancelRegistration = async (req, res, next) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
    if (reg.user.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    reg.status = 'cancelled';
    await reg.save();
    await Event.findByIdAndUpdate(reg.event, { $inc: { currentParticipants: -1 } });
    res.json({ success: true, message: 'Registration cancelled' });
  } catch (err) { next(err); }
};

// @desc  Get participants for event (organizer/admin)
// @route GET /api/registrations/event/:eventId
exports.getEventParticipants = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId, status: { $ne: 'cancelled' } })
      .populate('user', 'name email usn phone department year')
      .populate('event', 'title festName')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: registrations.length, registrations });
  } catch (err) { next(err); }
};

// @desc  Export participants as CSV
// @route GET /api/registrations/event/:eventId/export
exports.exportParticipants = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId, status: { $ne: 'cancelled' } })
      .populate('user', 'name email usn phone department year');

    const data = registrations.map(r => ({
      'Registration ID': r.registrationId,
      'Name': r.user?.name,
      'USN': r.user?.usn,
      'Email': r.user?.email,
      'Phone': r.user?.phone,
      'Department': r.user?.department,
      'Year': r.user?.year,
      'Participation Type': r.participationType,
      'Team Name': r.teamName || '-',
      'Status': r.status,
      'Registered At': new Date(r.createdAt).toLocaleString(),
    }));

    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('participants.csv');
    res.send(csv);
  } catch (err) { next(err); }
};

// @desc  Check-in participant
// @route PUT /api/registrations/:id/checkin
exports.checkIn = async (req, res, next) => {
  try {
    const reg = await Registration.findByIdAndUpdate(
      req.params.id,
      { checkedIn: true, checkedInAt: new Date() },
      { new: true }
    );
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.json({ success: true, registration: reg });
  } catch (err) { next(err); }
};
