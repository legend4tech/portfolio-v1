"use server";

import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  try {
    // Get form data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Format date for email
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL as string,
      to: process.env.CONTACT_EMAIL as string,
      subject: `✨ New Business Inquiry from ${name}`,
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
Received on: ${date}
      `,
      // Enhanced HTML version with professional styling
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Contact Form Submission</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333333;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 0; background: linear-gradient(to right, #1a1a2e, #4a4a82); border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;">
                    <img src="https://www.legend4tech.com/logo.png" alt="Legend4Tech Logo" style="display: block; margin: 0 auto; padding: 20px 0; max-width: 150px; height: auto;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 30px 10px 30px; text-align: center; background-color: #1a1a2e; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Business Inquiry</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; color: #b8b8d4;">Received on ${date}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <!-- Sender Profile -->
                <tr>
                  <td style="padding: 0 0 20px 0; border-bottom: 1px solid #eeeeee;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                      <tr>
                        <td width="80" style="padding: 0; vertical-align: top;">
                          <!-- Fixed avatar with properly centered initial -->
                          <div style="width: 60px; height: 60px; background-color: #4a4a82; border-radius: 50%; text-align: center; font-size: 24px; color: white; font-weight: bold;">
                            <span style="display: inline-block; line-height: 60px; width: 100%; text-align: center;">${name.charAt(0).toUpperCase()}</span>
                          </div>
                        </td>
                        <td style="padding: 0; vertical-align: middle;">
                          <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #333333;">${name}</h2>
                          <p style="margin: 5px 0 0 0; font-size: 16px; color: #666666;">${email}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Message -->
                <tr>
                  <td style="padding: 20px 0 0 0;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #333333;">Message:</h3>
                    <div style="background-color: #f5f5f9; border-left: 4px solid #4a4a82; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                      <p style="margin: 0; font-size: 16px; line-height: 1.6; white-space: pre-line; color: #444444;">${message}</p>
                    </div>
                  </td>
                </tr>
                
                <!-- Call to Action -->
                <tr>
                  <td style="padding: 20px 0 0 0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                      <tr>
                        <td style="padding: 0; text-align: center;">
                          <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(to right, #4a4a82, #6a6aa8); color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: 500; font-size: 16px;">Reply to ${name}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #f5f5f9; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                <tr>
                  <td style="padding: 20px 30px; text-align: center; color: #666666;">
                    <p style="margin: 0 0 10px 0; font-size: 14px;">This message was sent from the contact form on <a href="https://www.legend4tech.com" style="color: #4a4a82; text-decoration: none; font-weight: 500;">legend4tech.com</a></p>
                    <p style="margin: 0; font-size: 14px;">© ${new Date().getFullYear()} Legend4Tech. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendContactEmail:", error);
    throw new Error("Failed to send email");
  }
}
