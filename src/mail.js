import nodemailer from 'nodemailer';

// Generalized function to send emails
const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Set up email transporter (Gmail example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Set up email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email
      to,                           // Recipient's email
      subject,                      // Email subject
      html: htmlContent,            // Email content in HTML format
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
