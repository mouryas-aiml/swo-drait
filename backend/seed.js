require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Fest = require('./models/Fest');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swo-drait');
  console.log('✅ Connected to MongoDB');
};

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  await Event.deleteMany({});
  await Fest.deleteMany({});

  // Seed users
  const hashedPwd = await bcrypt.hash('password123', 12);
  const admin = await User.create({ name: 'Admin User', email: 'admin@drait.edu', password: hashedPwd, role: 'admin', department: 'Admin', year: 'Faculty' });
  const organizer = await User.create({ name: 'SWO Organizer', email: 'swo@drait.edu', password: hashedPwd, role: 'organizer', department: 'SWO', year: 'Faculty' });
  const student1 = await User.create({ name: 'Rahul Kumar', email: 'student@drait.edu', password: hashedPwd, role: 'student', usn: '1DA22CS001', phone: '9876543210', department: 'CSE', year: '3rd Year' });

  console.log('👤 Users seeded');

  // Seed fests
  await Fest.create([
    { name: 'Kannada Kalarava', tagline: 'ಕನ್ನಡ ಕಲೆಯ ಮಹೋತ್ಸವ', description: 'A grand celebration of Kannada culture, arts, and heritage at DRAIT.', startDate: new Date('2026-04-15'), endDate: new Date('2026-04-17'), venue: 'DRAIT Campus, Bangalore', theme: { primary: '#f18b0a', secondary: '#f9c24f' }, registrationOpen: true },
    { name: 'Sanskrithi', tagline: 'Where Tradition Meets Creativity', description: 'A vibrant inter-college cultural fest celebrating diversity in arts and performances.', startDate: new Date('2026-04-22'), endDate: new Date('2026-04-24'), venue: 'DRAIT Auditorium, Bangalore', theme: { primary: '#7b6ef5', secondary: '#a9a4fd' }, registrationOpen: true },
  ]);
  console.log('🎪 Fests seeded');

  // Seed events
  const events = [
    { title: 'Bharatanatyam', festName: 'Kannada Kalarava', category: 'Dance', description: 'Experience the grace of classical Bharatanatyam. Solo and group performances welcome.', rules: ['Performance must be 5-8 minutes', 'Music track must be submitted 2 days prior', 'Props allowed', 'Costume compulsory'], venue: 'Main Auditorium', date: new Date('2026-04-15'), startTime: '10:00 AM', endTime: '1:00 PM', prizePool: { first: '₹5,000', second: '₹3,000', third: '₹1,500' }, maxTeamSize: 8, minTeamSize: 1, isGroup: true, maxParticipants: 50, isFeatured: true, day: 1, tags: ['classical', 'dance'], createdBy: organizer._id },
    { title: 'Folkdance Fest', festName: 'Kannada Kalarava', category: 'Dance', description: 'Celebrate Karnataka\'s rich folk dance traditions – Dollu Kunitha, Veeragase & more.', rules: ['Group of 5-12 members', 'Duration: 8-12 minutes', 'Folk theme mandatory', 'Audio track to be submitted beforehand'], venue: 'Open Air Stage', date: new Date('2026-04-15'), startTime: '2:00 PM', endTime: '5:00 PM', prizePool: { first: '₹8,000', second: '₹5,000', third: '₹2,500' }, maxTeamSize: 12, minTeamSize: 5, isGroup: true, maxParticipants: 60, isFeatured: true, day: 1, tags: ['folk', 'kannada'], createdBy: organizer._id },
    { title: 'Solo Singing', festName: 'Kannada Kalarava', category: 'Music', description: 'Showcase your vocal talent with Kannada devotional or filmi songs.', rules: ['Duration: 3-5 minutes', 'Kannada songs only', 'Instruments optional', 'No pre-recorded vocals'], venue: 'Seminar Hall', date: new Date('2026-04-16'), startTime: '10:00 AM', endTime: '1:00 PM', prizePool: { first: '₹3,000', second: '₹2,000', third: '₹1,000' }, maxTeamSize: 1, minTeamSize: 1, isGroup: false, maxParticipants: 40, isFeatured: false, day: 2, tags: ['singing', 'kannada'], createdBy: organizer._id },
    { title: 'Yakshagana', festName: 'Kannada Kalarava', category: 'Drama', description: 'Present the traditional coastal Karnataka art form of Yakshagana.', rules: ['Team of 6-15', 'Duration: 20-30 minutes', 'Traditional costumes mandatory', 'Must depict a mythological story'], venue: 'Main Auditorium', date: new Date('2026-04-16'), startTime: '4:00 PM', endTime: '7:00 PM', prizePool: { first: '₹10,000', second: '₹6,000', third: '₹3,000' }, maxTeamSize: 15, minTeamSize: 6, isGroup: true, maxParticipants: 45, isFeatured: true, day: 2, tags: ['yakshagana', 'drama'], createdBy: organizer._id },
    { title: 'Ranga Rangoli', festName: 'Kannada Kalarava', category: 'Fine Arts', description: 'Create stunning Rangoli designs inspired by Karnataka\'s culture and traditions.', rules: ['Solo or duo (max 2)', 'Size: 4x4 feet', 'Colors provided', 'Duration: 2 hours', 'No stencils allowed'], venue: 'College Corridor', date: new Date('2026-04-17'), startTime: '9:00 AM', endTime: '11:00 AM', prizePool: { first: '₹2,000', second: '₹1,500', third: '₹1,000' }, maxTeamSize: 2, minTeamSize: 1, isGroup: false, maxParticipants: 30, isFeatured: false, day: 3, tags: ['rangoli', 'art'], createdBy: organizer._id },
    { title: 'Western Dance Battle', festName: 'Sanskrithi', category: 'Dance', description: 'Show off your moves in this high-energy western dance face-off.', rules: ['Group of 4-10', 'Duration: 5-10 minutes', 'Any western dance form', 'No objectionable content'], venue: 'Open Air Stage', date: new Date('2026-04-22'), startTime: '3:00 PM', endTime: '7:00 PM', prizePool: { first: '₹7,000', second: '₹4,000', third: '₹2,000' }, maxTeamSize: 10, minTeamSize: 4, isGroup: true, maxParticipants: 70, isFeatured: true, day: 1, tags: ['western', 'hip-hop'], createdBy: organizer._id },
    { title: 'Battle of Bands', festName: 'Sanskrithi', category: 'Music', description: 'Form your band and rock the stage at the biggest music showdown of the year!', rules: ['Team of 3-6 members', 'Duration: 15-20 minutes', 'Own instruments required', 'Original or cover songs allowed', 'No playback'], venue: 'Main Stage', date: new Date('2026-04-22'), startTime: '6:00 PM', endTime: '9:00 PM', prizePool: { first: '₹15,000', second: '₹10,000', third: '₹5,000' }, maxTeamSize: 6, minTeamSize: 3, isGroup: true, maxParticipants: 30, isFeatured: true, day: 1, tags: ['band', 'rock', 'music'], createdBy: organizer._id },
    { title: 'Fashion Fiesta', festName: 'Sanskrithi', category: 'Fashion', description: 'Walk the ramp and express your unique style at the biggest fashion show!', rules: ['Group of 8-20', 'Theme to be declared at registration', 'Western + traditional fusion allowed', 'Duration: 12-15 minutes'], venue: 'Main Auditorium', date: new Date('2026-04-23'), startTime: '2:00 PM', endTime: '5:00 PM', prizePool: { first: '₹12,000', second: '₹8,000', third: '₹4,000' }, maxTeamSize: 20, minTeamSize: 8, isGroup: true, maxParticipants: 80, isFeatured: true, day: 2, tags: ['fashion', 'ramp'], createdBy: organizer._id },
    { title: 'One Act Play', festName: 'Sanskrithi', category: 'Drama', description: 'A one-act theatrical masterpiece. Bring your story to life on stage.', rules: ['Team of 3-10', 'Duration: 20-25 minutes', 'Any language allowed', 'Props own responsibility', 'Social theme preferred'], venue: 'Seminar Hall', date: new Date('2026-04-23'), startTime: '10:00 AM', endTime: '1:00 PM', prizePool: { first: '₹8,000', second: '₹5,000', third: '₹2,500' }, maxTeamSize: 10, minTeamSize: 3, isGroup: true, maxParticipants: 60, isFeatured: false, day: 2, tags: ['drama', 'theater'], createdBy: organizer._id },
    { title: 'Debate Championship', festName: 'Sanskrithi', category: 'Literary', description: 'Sharpen your wit and debating skills in this power-packed competition.', rules: ['Duo teams only', 'Topics revealed on spot', '2 minutes per argument', 'English/Hindi/Kannada'), entryFee: 0], venue: 'Conference Room', date: new Date('2026-04-24'), startTime: '10:00 AM', endTime: '1:00 PM', prizePool: { first: '₹3,000', second: '₹2,000', third: '₹1,000' }, maxTeamSize: 2, minTeamSize: 2, isGroup: true, maxParticipants: 40, isFeatured: false, day: 3, tags: ['debate', 'literary'], createdBy: organizer._id },
    { title: 'Nukkad Natak', festName: 'Sanskrithi', category: 'Drama', description: 'Street theater performance with a social message – impactful and powerful.', rules: ['Team of 5-12', 'Duration: 10-15 minutes', 'Social theme mandatory', 'No props/mics – street style'], venue: 'College Plaza', date: new Date('2026-04-24'), startTime: '3:00 PM', endTime: '5:00 PM', prizePool: { first: '₹6,000', second: '₹4,000', third: '₹2,000' }, maxTeamSize: 12, minTeamSize: 5, isGroup: true, maxParticipants: 50, isFeatured: false, day: 3, tags: ['street', 'theater'], createdBy: organizer._id },
    { title: 'Photography Hunt', festName: 'Sanskrithi', category: 'Fine Arts', description: 'Explore the campus and capture moments in this exciting photo challenge.', rules: ['Solo only', 'Own camera/phone required', 'Theme revealed on day', 'Max 5 photos to submit', 'No filters'], venue: 'Campus-wide', date: new Date('2026-04-22'), startTime: '9:00 AM', endTime: '12:00 PM', prizePool: { first: '₹2,500', second: '₹1,500', third: '₹1,000' }, maxTeamSize: 1, minTeamSize: 1, isGroup: false, maxParticipants: 35, isFeatured: false, day: 1, tags: ['photography', 'art'], createdBy: organizer._id },
  ];

  await Event.insertMany(events);
  console.log('🎉 Events seeded');

  console.log('\n📝 Seeded Credentials:');
  console.log('  Admin:     admin@drait.edu / password123');
  console.log('  Organizer: swo@drait.edu / password123');
  console.log('  Student:   student@drait.edu / password123');
  mongoose.disconnect();
};

seed().catch(err => { console.error(err); mongoose.disconnect(); });
