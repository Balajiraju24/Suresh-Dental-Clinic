/**
 * ==============================================================================
 * Suresh Dental Clinic & Implant Centre - Contact Form Backend
 * ==============================================================================
 * Google Apps Script Web App Endpoint for Appointment Requests & Enquiries
 * 
 * Target Recipient: balajiraju24@gmail.com
 * Clinic: Dr. R. Suresh MDS, PhD, DSc Dental Clinic and Implant Centre
 * Address: Venkatraman St, Sector 1, Raja Annamalaipuram, Chennai 600028
 * Phone: +91 75987 65787
 * ==============================================================================
 */

// Global Configuration
const CONFIG = {
  // Primary email address to receive all new consultation enquiries
  RECIPIENT_EMAIL: "balajiraju24@gmail.com",
  
  // Clinic Branding & Contact Information
  CLINIC_NAME: "Dr. R. Suresh MDS, PhD, DSc Dental Clinic and Implant Centre",
  CLINIC_SHORT_NAME: "Dr. Suresh Dental Clinic & Implant Centre",
  CLINIC_PHONE: "+91 75987 65787",
  CLINIC_ADDRESS: "Venkatraman St, Sector 1, Raja Annamalaipuram, Chennai, Tamil Nadu 600028",
  CLINIC_HOURS: "Mon – Sat: 10:00 AM – 12:00 PM | 4:30 PM – 8:30 PM (Sunday Closed)",
  CLINIC_WEBSITE: "https://drsureshdental.com",
  
  // Name of the Google Sheet tab where appointments will be logged
  SHEET_NAME: "Appointment Enquiries",
  
  // Automatically send an acknowledgement receipt to patient if they provide an email
  SEND_PATIENT_CONFIRMATION: true
};

/**
 * HTTP POST Handler - Receives form submissions from the website
 */
function doPost(e) {
  try {
    // 1. Parse incoming payload (supports both JSON payload and standard form data)
    let data = {};
    
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        // Fallback for url-encoded form data
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // 2. Anti-Spam Honeypot Check
    // If hidden 'botField' or 'hp_address' is populated, silently return success without sending emails
    if (data.botField || data.hp_address) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        referenceId: "FILTERED",
        message: "Request processed."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Extract & sanitize form fields
    const fullName = (data.fullName || data.name || "Anonymous Patient").trim();
    const contactMethod = (data.contactMethod || "phone").toLowerCase();
    const contactDetail = (data.contactDetail || data.phone || data.email || "").trim();
    const preferredTiming = (data.preferredTiming || data.timing || "General Enquiry (Flexible)").trim();
    const enquiryMessage = (data.enquiryMessage || data.message || "No specific notes provided.").trim();
    const timestamp = new Date();
    
    // Format timestamp in IST (Indian Standard Time)
    const formattedDate = Utilities.formatDate(timestamp, "Asia/Kolkata", "dd MMM yyyy, hh:mm a 'IST'");

    // Generate Unique Reference ID (e.g., SDC-2026-9481)
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceId = "SDC-" + Utilities.formatDate(timestamp, "Asia/Kolkata", "yyyy") + "-" + randomDigits;

    // 4. Log to Google Sheets (if bound to a spreadsheet)
    logToGoogleSheet({
      referenceId: referenceId,
      timestamp: formattedDate,
      fullName: fullName,
      contactMethod: contactMethod,
      contactDetail: contactDetail,
      preferredTiming: preferredTiming,
      enquiryMessage: enquiryMessage
    });

    // 5. Send Notification Email to Clinic Admin (balajiraju24@gmail.com)
    sendAdminNotificationEmail({
      referenceId: referenceId,
      timestamp: formattedDate,
      fullName: fullName,
      contactMethod: contactMethod,
      contactDetail: contactDetail,
      preferredTiming: preferredTiming,
      enquiryMessage: enquiryMessage
    });

    // 6. Send Courtesy Confirmation Email to Patient (if valid email provided)
    const isEmailContact = contactMethod === "email" || (contactDetail.indexOf("@") !== -1 && contactDetail.indexOf(".") !== -1);
    if (CONFIG.SEND_PATIENT_CONFIRMATION && isEmailContact) {
      sendPatientConfirmationEmail({
        recipientEmail: contactDetail,
        patientName: fullName,
        referenceId: referenceId,
        preferredTiming: preferredTiming,
        enquiryMessage: enquiryMessage
      });
    }

    // 7. Return Success Response
    const responsePayload = {
      status: "success",
      referenceId: referenceId,
      message: "Appointment request received successfully.",
      timestamp: formattedDate
    };

    return ContentService.createTextOutput(JSON.stringify(responsePayload))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());

    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server error processing request: " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * HTTP GET Handler - Health-check endpoint
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    service: "Suresh Dental Clinic Appointment Booking API",
    recipient: CONFIG.RECIPIENT_EMAIL,
    clinic: CONFIG.CLINIC_NAME,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Appends new row to active Google Sheet
 */
function logToGoogleSheet(record) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      Logger.log("No spreadsheet bound to this Apps Script. Skipping sheet logging.");
      return;
    }

    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      // Create headers
      sheet.appendRow([
        "Reference ID",
        "Submission Timestamp",
        "Patient Full Name",
        "Preferred Contact Method",
        "Contact Number / Email",
        "Preferred Consultation Slot",
        "Enquiry / Treatment Notes",
        "Status",
        "Follow-up Notes"
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      record.referenceId,
      record.timestamp,
      record.fullName,
      record.contactMethod.toUpperCase(),
      record.contactDetail,
      record.preferredTiming,
      record.enquiryMessage,
      "New Enquiry",
      ""
    ]);

  } catch (err) {
    Logger.log("Warning: Could not log row to sheet: " + err.toString());
  }
}

/**
 * Helper: Sends structured HTML notification to balajiraju24@gmail.com
 */
function sendAdminNotificationEmail(data) {
  const isPhone = data.contactMethod === "phone" || data.contactDetail.indexOf("@") === -1;
  const directActionLink = isPhone 
    ? "tel:" + data.contactDetail.replace(/[^0-9+]/g, "")
    : "mailto:" + data.contactDetail;
  const directActionText = isPhone ? "📞 Call Patient Now (" + data.contactDetail + ")" : "✉️ Reply to Patient";

  const emailSubject = "🦷 New Appointment Request: " + data.fullName + " [" + data.referenceId + "]";

  const emailBodyHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
      
      <!-- Clinic Brand Header -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px 24px; color: #ffffff;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #38bdf8; font-weight: 700; margin-bottom: 6px;">
          SURESH DENTAL CLINIC &amp; IMPLANT CENTRE
        </div>
        <h1 style="margin: 0; font-size: 20px; font-weight: 800; line-height: 1.3; color: #ffffff;">
          New Consultation Enquiry
        </h1>
        <div style="font-size: 13px; color: #94a3b8; margin-top: 6px;">
          Reference ID: <span style="font-family: monospace; color: #f8fafc; font-weight: 700;">${data.referenceId}</span> &bull; ${data.timestamp}
        </div>
      </div>

      <!-- Quick Action Alert Box -->
      <div style="background-color: #f0fdf4; border-bottom: 1px solid #bbf7d0; padding: 16px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <div style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">
                Patient Action Required
              </div>
              <div style="font-size: 13px; color: #15803d; margin-top: 2px;">
                Contact patient to confirm appointment schedule.
              </div>
            </td>
            <td align="right">
              <a href="${directActionLink}" style="display: inline-block; background-color: #0f766e; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; padding: 8px 14px; border-radius: 8px;">
                ${directActionText}
              </a>
            </td>
          </tr>
        </table>
      </div>

      <!-- Patient Data Table -->
      <div style="padding: 24px;">
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b; font-weight: 600; width: 35%;">Patient Name:</td>
            <td style="color: #0f172a; font-weight: 700; font-size: 15px;">${data.fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b; font-weight: 600;">Contact Method:</td>
            <td style="color: #0f172a; text-transform: capitalize;">${data.contactMethod}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b; font-weight: 600;">Contact Detail:</td>
            <td style="color: #0369a1; font-weight: 700;">
              <a href="${directActionLink}" style="color: #0369a1; text-decoration: none;">${data.contactDetail}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b; font-weight: 600;">Requested Slot:</td>
            <td style="color: #0f172a; font-weight: 600; background-color: #f8fafc; border-radius: 6px; padding: 8px;">
              ${data.preferredTiming}
            </td>
          </tr>
          <tr>
            <td style="color: #64748b; font-weight: 600; vertical-align: top; padding-top: 12px;">Enquiry / Notes:</td>
            <td style="color: #334155; line-height: 1.5; padding-top: 12px; white-space: pre-wrap;">${data.enquiryMessage}</td>
          </tr>
        </table>

        <!-- Clinic Consultation Hours Reminder -->
        <div style="margin-top: 24px; padding: 14px 16px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">
          <strong style="color: #0f172a;">Clinic Consultation Hours:</strong><br/>
          Morning: 10:00 AM – 12:00 PM | Evening: 4:30 PM – 8:30 PM (Monday – Saturday)<br/>
          Location: Venkatraman St, Sector 1, Raja Annamalaipuram, Chennai 600028
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
        Automated message from <strong>${CONFIG.CLINIC_NAME}</strong> website contact form.
      </div>

    </div>
  </body>
  </html>
  `;

  // Send email using MailApp or GmailApp
  MailApp.sendEmail({
    to: CONFIG.RECIPIENT_EMAIL,
    subject: emailSubject,
    htmlBody: emailBodyHtml
  });
}

/**
 * Helper: Sends courtesy confirmation email to patient
 */
function sendPatientConfirmationEmail(data) {
  try {
    const subject = "Consultation Request Received - " + CONFIG.CLINIC_SHORT_NAME;
    const bodyHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px; color: #ffffff;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #38bdf8; font-weight: 700; margin-bottom: 4px;">
            ${CONFIG.CLINIC_NAME}
          </div>
          <h1 style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff;">
            We Have Received Your Appointment Request
          </h1>
        </div>

        <div style="padding: 24px; font-size: 14px; line-height: 1.6; color: #334155;">
          <p>Dear <strong>${data.patientName}</strong>,</p>
          
          <p>
            Thank you for reaching out to <strong>${CONFIG.CLINIC_SHORT_NAME}</strong> in Raja Annamalaipuram, Chennai. We have received your consultation scheduling request under reference number:
          </p>
          
          <div style="text-align: center; margin: 18px 0;">
            <span style="display: inline-block; background-color: #f0fdf4; border: 1px solid #86efac; color: #166534; font-family: monospace; font-size: 16px; font-weight: 800; padding: 8px 18px; border-radius: 8px;">
              ${data.referenceId}
            </span>
          </div>

          <p>
            <strong>Requested Consultation Slot:</strong><br/>
            ${data.preferredTiming}
          </p>

          <p>
            Our clinic desk is reviewing specialist availability and will contact you directly to confirm your appointment time and discuss any preparatory guidelines for your visit.
          </p>

          <div style="margin-top: 20px; padding: 14px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">
            <strong>Immediate Assistance or Urgent Enquiries:</strong><br/>
            Telephone: <a href="tel:${CONFIG.CLINIC_PHONE.replace(/[^0-9+]/g, '')}" style="color: #0284c7; font-weight: 700;">${CONFIG.CLINIC_PHONE}</a><br/>
            Hours: ${CONFIG.CLINIC_HOURS}<br/>
            Location: ${CONFIG.CLINIC_ADDRESS}
          </div>

          <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
            Warm regards,<br/>
            <strong>Clinical Reception Team</strong><br/>
            ${CONFIG.CLINIC_NAME}
          </p>
        </div>

      </div>
    </body>
    </html>
    `;

    MailApp.sendEmail({
      to: data.recipientEmail,
      subject: subject,
      htmlBody: bodyHtml
    });
  } catch (err) {
    Logger.log("Warning: Could not send patient auto-reply: " + err.toString());
  }
}
