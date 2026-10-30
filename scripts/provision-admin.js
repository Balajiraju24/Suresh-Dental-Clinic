#!/usr/bin/env node

/**
 * Secure Initial Administrator Provisioning Utility
 * Dr. R. Suresh MDS, PhD, DSc Dental Clinic & Implant Centre
 * 
 * Usage:
 *   node scripts/provision-admin.js [admin_email] [admin_display_name]
 * 
 * Requirements:
 *   - GOOGLE_APPLICATION_CREDENTIALS pointing to service account JSON key,
 *     OR run in an authenticated gcloud/Firebase CLI environment.
 * 
 * Security:
 *   - NO default hard-coded passwords.
 *   - Interactively requests an administrative password or outputs a one-time
 *     cryptographically signed password setup link.
 *   - Stamps custom claim `admin: true` and `role: 'administrator'`.
 *   - Creates Firestore document in `/staff/{uid}`.
 */

const readline = require("readline");
const path = require("path");
const fs = require("fs");

let admin;
try {
  admin = require("firebase-admin");
} catch (e) {
  console.error("firebase-admin is required. Run 'pnpm add -D firebase-admin' or install in functions/ directory.");
  process.exit(1);
}

// Initialize Admin SDK with credentials
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
  path.join(__dirname, "..", "service-account.json");

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(path.resolve(serviceAccountPath));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || "suresh-dental-clinic",
  });
} else {
  // Attempt default application credentials
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || "suresh-dental-clinic",
  });
}

const auth = admin.auth();
const db = admin.firestore();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function run() {
  console.log("\n========================================================");
  console.log("  Dr. R. Suresh Dental Clinic - Admin Provisioning Tool  ");
  console.log("  Raja Annamalaipuram, Chennai, Tamil Nadu               ");
  console.log("========================================================\n");

  const defaultEmail = process.argv[2] || "dr.suresh@drsureshdental.com";
  const defaultName = process.argv[3] || "Dr. R. Suresh";

  const email = (await question(`Enter Administrator Email [${defaultEmail}]: `)) || defaultEmail;
  const displayName = (await question(`Enter Administrator Name [${defaultName}]: `)) || defaultName;

  console.log(`\nProvisioning administrator account for: ${displayName} <${email}>`);
  console.log("Select password method:");
  console.log("  1) Enter a secure password interactively (min 8 chars)");
  console.log("  2) Generate a one-time secure password setup link");
  const choice = (await question("Choice [1 or 2, default 2]: ")) || "2";

  let password = null;
  if (choice === "1") {
    password = await question("Enter secure password: ");
    if (!password || password.length < 8) {
      console.error("Password must be at least 8 characters long.");
      rl.close();
      process.exit(1);
    }
  }

  rl.close();

  try {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log(`\nExisting user found (UID: ${userRecord.uid}). Updating roles...`);
      if (password) {
        await auth.updateUser(userRecord.uid, { password, displayName, emailVerified: true });
      }
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        console.log("\nCreating new Firebase Authentication user...");
        const createParams = {
          email,
          displayName,
          emailVerified: true,
          disabled: false,
        };
        if (password) {
          createParams.password = password;
        }
        userRecord = await auth.createUser(createParams);
      } else {
        throw err;
      }
    }

    // Assign custom claims for server-side authority
    console.log("Setting custom claims: { role: 'administrator', admin: true }...");
    await auth.setCustomUserClaims(userRecord.uid, {
      role: "administrator",
      admin: true,
    });

    // Write to Firestore /staff/{uid}
    console.log(`Writing profile to Firestore /staff/${userRecord.uid}...`);
    await db.collection("staff").doc(userRecord.uid).set(
      {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || displayName,
        role: "administrator",
        phoneNumber: "+91 98400 12345",
        specialization: "Lead Periodontist & Implantologist (MDS, PhD, DSc)",
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // If choice was 2 or no password specified, generate secure link
    if (!password) {
      const resetLink = await auth.generatePasswordResetLink(email);
      console.log("\n[SUCCESS] One-Time Secure Password Setup Link Generated:");
      console.log("--------------------------------------------------------");
      console.log(resetLink);
      console.log("--------------------------------------------------------");
      console.log("Share this link securely with Dr. R. Suresh to set his password.");
    } else {
      console.log("\n[SUCCESS] Administrator password established successfully.");
    }

    console.log("\nAdministrator provisioning complete!");
    console.log(`Dr. Suresh can now log in at: /staff/login using ${email}\n`);
    process.exit(0);
  } catch (err) {
    console.error("\n[ERROR] Provisioning failed:", err.message || err);
    process.exit(1);
  }
}

run();

