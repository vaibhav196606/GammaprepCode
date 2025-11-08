const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Send enrollment confirmation email
const sendEnrollmentEmail = async (userEmail, userName, orderDetails, batchStartDate) => {
  const formattedStartDate = batchStartDate 
    ? new Date(batchStartDate).toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'To be announced';
  try {
    const { data, error } = await resend.emails.send({
      from: 'Gammaprep Bootcamp <info@gammaprep.com>',
      to: [userEmail],
      subject: '🎉 Welcome to Gammaprep Live Classes Bootcamp!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 0;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .logo {
              max-width: 200px;
              height: auto;
              margin-bottom: 20px;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .highlight-box {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: center;
            }
            .details {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            .info-box {
              background: #e0e7ff;
              padding: 15px;
              border-radius: 8px;
              margin: 15px 0;
              border-left: 4px solid #4f46e5;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
            ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            ul li {
              margin: 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://gammaprep.com/gammaprep_logo_main.png" alt="Gammaprep Logo" class="logo" />
            <h1>🎉 Welcome to Gammaprep Live Bootcamp!</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName},</h2>
            <p>Congratulations! Your enrollment in the <strong>Gammaprep Live Classes Bootcamp</strong> has been confirmed. We're excited to have you on board! 🚀</p>
            
            <div class="highlight-box">
              <h3 style="margin-top: 0;">📅 Classes Start From</h3>
              <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${formattedStartDate}</p>
            </div>

            <div class="details">
              <h3>📋 Enrollment Details</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Amount Paid:</strong> ₹${orderDetails.amount.toLocaleString('en-IN')}</p>
              <p><strong>Payment Date:</strong> ${new Date(orderDetails.paymentTime).toLocaleDateString('en-IN')}</p>
              ${orderDetails.transactionId ? `<p><strong>Transaction ID:</strong> ${orderDetails.transactionId}</p>` : ''}
            </div>

            <h3>🚀 What Happens Next?</h3>
            
            <div class="info-box">
              <p style="margin: 0;"><strong>📱 WhatsApp Group:</strong> You will be added to our exclusive WhatsApp group within <strong>24 hours</strong>. All course updates, class links, and materials will be shared there.</p>
            </div>

            <h3>📚 What You'll Get:</h3>
            <ul>
              <li><strong>Live Interactive Classes</strong> - Learn from industry experts in real-time</li>
              <li><strong>Class Recordings</strong> - After each class, recordings will be shared in the WhatsApp group for revision</li>
              <li><strong>Course Materials</strong> - Comprehensive study materials and resources</li>
              <li><strong>Mock Interviews & Tests</strong> - Regular evaluation and feedback</li>
              <li><strong>Mentor Support</strong> - Connect with your mentor once the classes begin for personalized guidance</li>
              <li><strong>Assured Job Referrals</strong> - Get referrals to top MNCs after course completion</li>
            </ul>

            <div class="info-box">
              <p style="margin: 0;"><strong>💡 Pro Tip:</strong> Keep your WhatsApp active and check the group regularly for important updates and class schedules!</p>
            </div>

            <p>If you have any questions before the bootcamp starts, feel free to reach out to us at <a href="mailto:info@gammaprep.com" style="color: #667eea;">info@gammaprep.com</a> or WhatsApp us at <strong>+91 8890240404</strong>.</p>

            <p style="font-size: 18px; margin-top: 30px;">We're excited to help you crack your dream job! 🎯</p>

            <p>Best regards,<br/><strong>The Gammaprep Team</strong></p>
          </div>
          <div class="footer">
            <p><strong>Gammaprep - Gamma Tech & Services LLP</strong></p>
            <p>Crack interviews for SDE/MLE roles at top product companies</p>
            <p>
              <a href="https://gammaprep.com" style="color: #667eea; text-decoration: none;">Website</a> |
              <a href="mailto:info@gammaprep.com" style="color: #667eea; text-decoration: none;">Email</a> |
              <a href="https://wa.me/918890240404" style="color: #667eea; text-decoration: none;">WhatsApp</a>
            </p>
            <p style="color: #999; margin-top: 20px;">
              © ${new Date().getFullYear()} Gammaprep. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data.id };

  } catch (error) {
    console.error('Error sending enrollment email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEnrollmentEmail
};

