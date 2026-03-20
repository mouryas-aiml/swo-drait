const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const teamMemberSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  usn:        { type: String, required: true },
  email:      { type: String },
  phone:      { type: String },
  department: { type: String },
  year:       { type: String },
}, { _id: false });

const registrationSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    unique: true,
    default: () => 'REG-' + uuidv4().split('-')[0].toUpperCase(),
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teamName: { type: String, trim: true },
  teamMembers: [teamMemberSchema],
  participationType: {
    type: String,
    enum: ['solo', 'group'],
    default: 'solo',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'waitlisted'],
    default: 'confirmed',
  },
  qrData: { type: String },
  paymentStatus: {
    type: String,
    enum: ['free', 'paid', 'pending'],
    default: 'free',
  },
  remarks: { type: String },
  checkedIn: { type: Boolean, default: false },
  checkedInAt: { type: Date },
}, { timestamps: true });

// Auto-generate QR data before saving
registrationSchema.pre('save', function (next) {
  if (!this.qrData) {
    this.qrData = JSON.stringify({
      registrationId: this.registrationId,
      eventId: this.event,
      userId: this.user,
    });
  }
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);
