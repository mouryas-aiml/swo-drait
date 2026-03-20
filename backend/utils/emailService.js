const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
};

exports.sendRegistrationEmail = async (email, registration) => {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') return;
  try {
    const transporter = createTransporter();
    const { registrationId, event, participationType } = registration;
    await transporter.sendMail({
      from: `"DRAIT Cultural Events" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Registration Confirmed – ${event?.title || 'Event'}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#0f0f1a;color:#fff;padding:30px;border-radius:12px">
          <div style="text-align:center;margin-bottom:24px">
            <h1 style="color:#f18b0a;margin:0">🎭 DRAIT Cultural Events</h1>
            <p style="color:#9ca3af;margin:4px 0">Registration Confirmed!</p>
          </div>
          <div style="background:#16162a;padding:20px;border-radius:8px;border:1px solid #2a2a4a">
            <h2 style="color:#f9c24f;margin:0 0 16px">Registration Details</h2>
            <table style="width:100%">
              <tr><td style="color:#9ca3af;padding:6px 0">Registration ID</td><td style="color:#fff;font-weight:bold">${registrationId}</td></tr>
              <tr><td style="color:#9ca3af;padding:6px 0">Event</td><td style="color:#fff">${event?.title}</td></tr>
              <tr><td style="color:#9ca3af;padding:6px 0">Fest</td><td style="color:#f18b0a">${event?.festName}</td></tr>
              <tr><td style="color:#9ca3af;padding:6px 0">Venue</td><td style="color:#fff">${event?.venue}</td></tr>
              <tr><td style="color:#9ca3af;padding:6px 0">Date</td><td style="color:#fff">${event?.date ? new Date(event.date).toDateString() : '-'}</td></tr>
              <tr><td style="color:#9ca3af;padding:6px 0">Type</td><td style="color:#7b6ef5">${participationType}</td></tr>
            </table>
          </div>
          <p style="color:#9ca3af;text-align:center;margin-top:24px;font-size:14px">
            Please show your QR pass at the venue. Good luck! 🎉<br/>
            <strong style="color:#f18b0a">DRAIT SWO Team</strong>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
};
