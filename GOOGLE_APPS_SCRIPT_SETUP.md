# Google Apps Script Backend Setup Guide

This guide explains how to connect the website's appointment enquiry form directly to **`balajiraju24@gmail.com`** and an optional Google Sheet CRM using a free Google Apps Script Web App.

---

## Architecture Overview

```
[Patient on Website]
        │
        ▼ (Submits Form)
[Google Apps Script Web App] (Runs on Google Cloud for free)
        ├── 1. Appends record to Google Sheet ("Appointment Enquiries")
        ├── 2. Dispatches priority HTML notification to balajiraju24@gmail.com
        └── 3. Sends confirmation email to patient (if email was provided)
```

- **Recipient:** `balajiraju24@gmail.com`
- **Cost:** 100% Free (Uses your personal Google Account quota: up to 100 emails/day on free accounts, or 1,500/day on Google Workspace).
- **Security:** Anti-spam honeypot included. No database or server management required.

---

## 5-Minute Setup Steps

### Step 1: Create a Google Sheet
1. Open your browser and go to [sheets.new](https://sheets.new) (logged into `balajiraju24@gmail.com`).
2. Title the spreadsheet: **`Suresh Dental Clinic - Patient Enquiries`**.

### Step 2: Open Apps Script Editor
1. In the Google Sheets menu, click **Extensions** > **Apps Script**.
2. Rename the project from *Untitled project* to **`Suresh Dental Clinic Form API`**.

### Step 3: Paste the Backend Script
1. Delete any default code in `Code.gs`.
2. Open the file [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) in this repository, copy all the code, and paste it into the Apps Script editor.
3. Click the **Save** icon (diskette icon) or press `Cmd + S` / `Ctrl + S`.

### Step 4: Deploy as a Web App
1. In the top-right corner of the Apps Script window, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Fill in the deployment settings:
   - **Description:** `Suresh Dental Clinic Contact Form v1`
   - **Execute as:** `Me (balajiraju24@gmail.com)` *(Important!)*
   - **Who has access:** `Anyone` *(Crucial: Allows the website form to submit without requiring patients to log into a Google account).*
4. Click **Deploy**.

### Step 5: Authorize Permissions
1. Google will display a popup: *"Authorization required"*. Click **Authorize access**.
2. Select your Google account (`balajiraju24@gmail.com`).
3. You will see a standard safety screen: *"Google hasn't verified this app"*.
   - Click **Advanced** (at the bottom).
   - Click **Go to Suresh Dental Clinic Form API (unsafe)**.
4. Click **Allow** to grant permissions to send emails and update your Google Sheet.

### Step 6: Copy Your Web App URL
1. Google will display your **Web app URL**:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
2. Copy this URL.

### Step 7: Connect the URL to the Website

#### Option A: Local Testing & Development
Create or edit `.env.local` in the project root:
```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

#### Option B: GitHub Actions / Firebase Production Deployment
Since your website deploys through GitHub Actions, add the URL as a GitHub Secret or build environment variable:
1. Go to your GitHub repository: `https://github.com/Balajiraju24/Suresh-Dental-Clinic/settings/secrets/actions`
2. Click **New repository secret**:
   - **Name:** `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
   - **Value:** `https://script.google.com/macros/s/AKfycb.../exec`
3. Click **Add secret**.
4. The next push will automatically embed this endpoint into the static production bundle!

---

## Testing Your Backend

1. **Browser Test:** Paste your Web App URL into a browser tab and press Enter. You should receive:
   ```json
   {
     "status": "ok",
     "service": "Suresh Dental Clinic Appointment Booking API",
     "recipient": "balajiraju24@gmail.com",
     "clinic": "Dr. R. Suresh MDS, PhD, DSc Dental Clinic and Implant Centre"
   }
   ```
2. **Form Test:** Visit `/contact#appointment-form` on the website, fill in a test name and telephone number, and click **Submit Appointment Enquiry**.
3. Check `balajiraju24@gmail.com` inbox for the formatted email notification with patient details and click-to-call action buttons.
4. Check your Google Sheet to see the row automatically appended!
