const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_MAIL,
    pass: process.env.APP_PASSWORD
  }
});

exports.sendOTP = async (email, otp) => {
  const mailOptions = {
    from: `"NEXUS Identity" <${process.env.APP_MAIL}>`,
    to: email,
    subject: `NEXUS Pulse: ${otp} is your verification code`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 20px; text-align: center; border: 1px solid #1a1a1a;">
        <div style="margin-bottom: 30px;">
          <h1 style="font-size: 28px; font-weight: 900; letter-spacing: -1px; margin: 0; text-transform: uppercase;">
            NEXUS<span style="color: #00f2ff;">.</span>
          </h1>
          <p style="font-size: 10px; font-weight: 900; letter-spacing: 4px; color: rgba(255,255,255,0.4); margin: 10px 0 0 0; text-transform: uppercase;">Identity Verification Hub</p>
        </div>
        
        <div style="background: rgba(0, 242, 255, 0.05); border: 1px solid rgba(0, 242, 255, 0.2); padding: 30px; border-radius: 16px; margin: 30px 0;">
          <p style="font-size: 14px; margin-bottom: 15px; color: rgba(255,255,255,0.7); font-style: italic;">Enter the following code to authorize your session:</p>
          <h2 style="font-size: 48px; letter-spacing: 12px; font-weight: 900; color: #00f2ff; margin: 0;">${otp}</h2>
        </div>
        
        <p style="font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.6;">
          This verification pulse expires in 10 minutes.<br/>
          If you did not request this authorization, please secure your credentials immediately.
        </p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1a1a1a;">
          <p style="font-size: 10px; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 1px;">&copy; 2026 NEXUS INDUSTRIAL SYSTEMS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Mail Error:', err);
    return false;
  }
};
