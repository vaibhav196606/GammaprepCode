const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Send enrollment confirmation email
const sendEnrollmentEmail = async (userEmail, userName, orderDetails) => {
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
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              text-align: center;
              color: white;
            }
            .content {
              padding: 30px;
              background: #f9f9f9;
            }
            .card {
              background: white;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .details {
              background: #f0f0f0;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
            }
            .details-row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
            .checkmark {
              color: #10b981;
              font-size: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Enrollment Successful!</h1>
            <p>Welcome to Gammaprep Live Classes Bootcamp</p>
          </div>
          
          <div class="content">
            <div class="card">
              <h2>Hi ${userName}! 👋</h2>
              <p>Congratulations! Your enrollment in the <strong>Gammaprep Live Classes Bootcamp</strong> has been confirmed.</p>
              
              <p><span class="checkmark">✓</span> Payment received successfully</p>
              <p><span class="checkmark">✓</span> Your spot in the bootcamp is confirmed</p>
              <p><span class="checkmark">✓</span> You're all set to start your journey!</p>
            </div>

            <div class="card">
              <h3>📋 Payment Details</h3>
              <div class="details">
                <div class="details-row">
                  <span><strong>Order ID:</strong></span>
                  <span>${orderDetails.orderId}</span>
                </div>
                <div class="details-row">
                  <span><strong>Amount Paid:</strong></span>
                  <span>₹${orderDetails.amount.toLocaleString('en-IN')}</span>
                </div>
                <div class="details-row">
                  <span><strong>Payment Date:</strong></span>
                  <span>${new Date(orderDetails.paymentTime).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
                ${orderDetails.transactionId ? `
                <div class="details-row">
                  <span><strong>Transaction ID:</strong></span>
                  <span style="font-size: 11px;">${orderDetails.transactionId}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <div class="card">
              <h3>🚀 What's Next?</h3>
              <ol>
                <li><strong>Class Schedule:</strong> You'll receive the class schedule and meeting links within 24 hours</li>
                <li><strong>WhatsApp Group:</strong> You'll be added to the batch WhatsApp group soon</li>
                <li><strong>Course Materials:</strong> Access to all study materials will be shared before the first class</li>
                <li><strong>Mentor Connect:</strong> Direct access to mentors throughout the bootcamp</li>
              </ol>
            </div>

            <div class="card">
              <h3>📚 Bootcamp Includes:</h3>
              <ul>
                <li>✓ Live Interactive Classes (No Recordings)</li>
                <li>✓ Data Structures & Algorithms (8 weeks)</li>
                <li>✓ System Design - HLD & LLD (4 weeks)</li>
                <li>✓ Data Science with Machine Learning (8 weeks)</li>
                <li>✓ Mock Interviews & Resume Building</li>
                <li>✓ Assured Job Referrals</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="https://gammaprep-project.vercel.app/dashboard" class="button">
                Go to Dashboard
              </a>
            </div>

            <div class="card" style="background: #fff3cd; border-left: 4px solid #ffc107;">
              <p style="margin: 0;"><strong>📞 Need Help?</strong></p>
              <p style="margin: 5px 0 0 0;">Contact us at <a href="mailto:info@gammaprep.com">info@gammaprep.com</a> for any queries.</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>Gammaprep</strong></p>
            <p>Crack interviews for SDE/MLE roles at top product companies</p>
            <p>
              <a href="https://gammaprep.com" style="color: #667eea; text-decoration: none;">Website</a> | 
              <a href="mailto:info@gammaprep.com" style="color: #667eea; text-decoration: none;">Email</a>
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

    console.log('Enrollment email sent successfully via Resend:', data.id);
    return { success: true, messageId: data.id };

  } catch (error) {
    console.error('Error sending enrollment email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEnrollmentEmail
};

