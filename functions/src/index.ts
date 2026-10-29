import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

type StaffRole = "administrator" | "receptionist" | "dentist" | "accounts";

/**
 * Helper to verify that the calling user is an authorized administrator.
 */
async function verifyAdminCaller(context: functions.https.CallableContext): Promise<{ uid: string; displayName: string }> {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required to perform privileged clinic operations."
    );
  }

  // Check custom claim first
  if (context.auth.token.role === "administrator" || context.auth.token.admin === true) {
    return {
      uid: context.auth.uid,
      displayName: context.auth.token.name || "Clinic Administrator",
    };
  }

  // Fallback to checking /staff/{uid} Firestore record
  const callerDoc = await db.collection("staff").doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data()?.role !== "administrator" || callerDoc.data()?.isActive !== true) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Action restricted: Only verified clinic administrators can execute this operation."
    );
  }

  return {
    uid: context.auth.uid,
    displayName: callerDoc.data()?.displayName || "Clinic Administrator",
  };
}

/**
 * Privileged Staff Account Creation
 * Callable only by verified clinic administrators.
 * Creates Auth user, sets role custom claims, creates /staff profile, and logs audit event.
 */
export const createStaffAccount = functions.https.onCall(async (data, context) => {
  const caller = await verifyAdminCaller(context);

  const { email, displayName, role, phoneNumber, specialization } = data;

  if (!email || !displayName || !role) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: email, displayName, and role are mandatory."
    );
  }

  const validRoles: StaffRole[] = ["administrator", "receptionist", "dentist", "accounts"];
  if (!validRoles.includes(role)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid staff role specified.");
  }

  try {
    // 1. Create Firebase Auth user
    const userRecord = await auth.createUser({
      email: email.trim().toLowerCase(),
      displayName: displayName.trim(),
      phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
      emailVerified: true,
      disabled: false,
    });

    // 2. Assign custom claims
    await auth.setCustomUserClaims(userRecord.uid, {
      role,
      admin: role === "administrator",
    });

    // 3. Create /staff document
    const staffDocData = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      role,
      phoneNumber: phoneNumber || null,
      specialization: specialization || null,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection("staff").doc(userRecord.uid).set(staffDocData);

    // 4. Generate password reset link for the invited user (no hardcoded password)
    const resetLink = await auth.generatePasswordResetLink(userRecord.email!);

    // 5. Append immutable audit log
    await db.collection("audit_logs").add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      actorUid: caller.uid,
      actorName: caller.displayName,
      actorRole: "administrator",
      action: "staff.provision",
      resourceType: "staff",
      resourceId: userRecord.uid,
      details: {
        email: userRecord.email,
        displayName: userRecord.displayName,
        role,
      },
    });

    return {
      success: true,
      uid: userRecord.uid,
      resetLink,
    };
  } catch (error: any) {
    throw new functions.https.HttpsError("internal", error.message || "Failed to create staff account.");
  }
});

/**
 * Privileged Staff Account Status Update (Activate / Deactivate)
 */
export const updateStaffStatus = functions.https.onCall(async (data, context) => {
  const caller = await verifyAdminCaller(context);

  const { uid, isActive } = data;
  if (!uid || typeof isActive !== "boolean") {
    throw new functions.https.HttpsError("invalid-argument", "Valid uid and isActive boolean required.");
  }

  if (uid === caller.uid && !isActive) {
    throw new functions.https.HttpsError("failed-precondition", "Administrators cannot deactivate themselves.");
  }

  try {
    // Update Auth user disabled state
    await auth.updateUser(uid, { disabled: !isActive });

    // Revoke refresh tokens if deactivating
    if (!isActive) {
      await auth.revokeRefreshTokens(uid);
    }

    // Update Firestore /staff/{uid}
    await db.collection("staff").doc(uid).update({
      isActive,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Audit log
    await db.collection("audit_logs").add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      actorUid: caller.uid,
      actorName: caller.displayName,
      actorRole: "administrator",
      action: isActive ? "staff.activate" : "staff.deactivate",
      resourceType: "staff",
      resourceId: uid,
      details: { isActive },
    });

    return { success: true };
  } catch (error: any) {
    throw new functions.https.HttpsError("internal", error.message || "Failed to update staff status.");
  }
});

