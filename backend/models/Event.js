const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  festName: {
    type: String,
    required: true,
    enum: ['Kannada Kalarava', 'Sanskrithi', 'Both'],
  },
  category: {
    type: String,
    required: true,
    enum: ['Dance', 'Music', 'Drama', 'Fashion', 'Literary', 'Fine Arts', 'Sports', 'Quiz', 'Other'],
  },
  description: { type: String, required: true },
  rules: [{ type: String }],
  venue: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  prizePool: {
    first: { type: String, default: '' },
    second: { type: String, default: '' },
    third: { type: String, default: '' },
  },
  entryFee: { type: Number, default: 0 },
  maxTeamSize: { type: Number, default: 1 },
  minTeamSize: { type: Number, default: 1 },
  isGroup: { type: Boolean, default: false },
  maxParticipants: { type: Number, default: 100 },
  currentParticipants: { type: Number, default: 0 },
  image: { type: String, default: '' },
  tags: [{ type: String }],
  coordinators: [{ name: String, phone: String, email: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  day: { type: Number, enum: [1, 2, 3], default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
