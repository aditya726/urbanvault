import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send appointment confirmation email to buyer
export const sendAppointmentEmail = async (appointmentData) => {
  const { buyerEmail, buyerName, propertyTitle, appointmentDate, appointmentTime, sellerName, propertyAddress } = appointmentData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: buyerEmail,
    subject: 'Property Viewing Appointment Confirmed - Urban Vault',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
          .detail { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #2563eb; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏡 Appointment Confirmed</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${buyerName}</strong>,</p>
            <p>Your property viewing appointment has been successfully scheduled!</p>
            
            <div class="detail">
              <strong>Property:</strong> ${propertyTitle}<br>
              <strong>Address:</strong> ${propertyAddress}
            </div>
            
            <div class="detail">
              <strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
              <strong>Time:</strong> ${appointmentTime}
            </div>
            
            <div class="detail">
              <strong>Meeting with:</strong> ${sellerName}
            </div>
            
            <p>Please arrive on time. If you need to reschedule or cancel, please log in to your dashboard.</p>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/appointments" class="button">View My Appointments</a>
            </center>
          </div>
          <div class="footer">
            <p>Urban Vault - Find Your Dream Home</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Appointment email sent to:', buyerEmail);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send notification email to seller
export const sendSellerNotificationEmail = async (sellerEmail, sellerName, buyerName, propertyTitle, appointmentDate, appointmentTime) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sellerEmail,
    subject: 'New Property Viewing Request - Urban Vault',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
          .detail { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #10b981; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 New Viewing Request</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${sellerName}</strong>,</p>
            <p>You have received a new property viewing request!</p>
            
            <div class="detail">
              <strong>Potential Buyer:</strong> ${buyerName}
            </div>
            
            <div class="detail">
              <strong>Property:</strong> ${propertyTitle}
            </div>
            
            <div class="detail">
              <strong>Requested Date:</strong> ${new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
              <strong>Requested Time:</strong> ${appointmentTime}
            </div>
            
            <p>Please review and confirm this appointment in your dashboard.</p>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/appointments" class="button">Manage Appointments</a>
            </center>
          </div>
          <div class="footer">
            <p>Urban Vault - Find Your Dream Home</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Seller notification email sent to:', sellerEmail);
  } catch (error) {
    console.error('Error sending seller email:', error);
  }
};
