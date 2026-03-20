const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Fest = require('../models/Fest');

// @desc  Get dashboard stats
// @route GET /api/admin/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalEvents, totalRegistrations, activeEvents] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Event.countDocuments({ isActive: true }),
      Registration.countDocuments({ status: 'confirmed' }),
      Event.countDocuments({ isActive: true }),
    ]);

    const festStats = await Registration.aggregate([
      { $match: { status: 'confirmed' } },
      { $lookup: { from: 'events', localField: 'event', foreignField: '_id', as: 'event' } },
      { $unwind: '$event' },
      { $group: { _id: '$event.festName', count: { $sum: 1 } } },
    ]);

    const categoryStats = await Event.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, registrations: { $sum: '$currentParticipants' } } },
      { $sort: { registrations: -1 } },
    ]);

    const recentRegistrations = await Registration.find({ status: 'confirmed' })
      .populate('user', 'name email usn')
      .populate('event', 'title festName category')
      .sort({ createdAt: -1 })
      .limit(10);

    const dailyRegistrations = await Registration.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalEvents, totalRegistrations, activeEvents },
      festStats,
      categoryStats,
      recentRegistrations,
      dailyRegistrations,
    });
  } catch (err) { next(err); }
};

// @desc  Get all users (admin)
// @route GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { usn: { $regex: search, $options: 'i' } },
    ];
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, count: users.length, total, users });
  } catch (err) { next(err); }
};

// @desc  Toggle user active status
// @route PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) { next(err); }
};

// @desc  Update user role
// @route PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// @desc  Manage fests
// @route GET /api/admin/fests
exports.getFests = async (req, res, next) => {
  try {
    const fests = await Fest.find();
    res.json({ success: true, fests });
  } catch (err) { next(err); }
};

// @desc  Create/Update fest
// @route POST /api/admin/fests
exports.upsertFest = async (req, res, next) => {
  try {
    const fest = await Fest.findOneAndUpdate(
      { name: req.body.name },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, fest });
  } catch (err) { next(err); }
};
