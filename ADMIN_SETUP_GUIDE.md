# Clinic Administrator Setup & Security Guide
## Dr. R. Suresh MDS, PhD, DSc Dental Clinic and Implant Centre
Location: Raja Annamalaipuram (R.A. Puram), Chennai, Tamil Nadu, India

This guide provides the instructions for securely provisioning the initial clinic administrator, deploying Firestore Security Rules, configuring Cloud Functions, and managing Role-Based Access Control (RBAC).

---

## 1. Security Architecture Principles

1. **No Public Registration**:
   - There is strictly no unrestricted self-registration for staff accounts.
   - All staff accounts are provisioned exclusively through trusted server-side workflows by an authorized Administrator.
2. **No Hard-coded Passwords or Secret Keys**:
   - Neither client-side code nor configuration files contain default administrative passwords or service account keys.
   - Initial administrative access is established via an interactive CLI provisioning tool or a one-time cryptographically signed setup link.
3. **Database-Level Authorization**:
   - Client-side navigation guards provide user interface convenience, but **Cloud Firestore Security Rules (`firestore.rules`)** and server-side callable functions are the actual security boundaries.
   - Default is **DENY**.

---

## 2. Initial Administrator Provisioning Procedure

To establish the primary administrator account for **Dr. R. Suresh**:

### Prerequisites
1. Ensure your Firebase project (`suresh-dental-clinic`) is configured in the Firebase Console.
2. Download your Firebase Admin service account key JSON from:
   - **Firebase Console** &rarr; **Project settings** &rarr; **Service accounts** &rarr; **Generate new private key**.
3. Save the key locally (e.g. `service-account.json` in repository root, which is gitignored).

### Execution
Run the provisioning script from the repository root:

```bash
# Option A: With environment variable
export GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"
node scripts/provision-admin.js dr.suresh@sureshdental.clinic "Dr. R. Suresh"

# Option B: Interactive prompt
node scripts/provision-admin.js
```

### What the script executes:
1. Creates or verifies the user in Firebase Authentication.
2. Grants Firebase Auth Custom Claims: `{ role: 'administrator', admin: true }`.
3. Creates a validated record in Firestore `/staff/{uid}` marked `isActive: true`.
4. Secure Password Setup:
   - **Method 1**: Prompt interactively for a private password without writing it to disk.
   - **Method 2 (Recommended)**: Outputs a single-use cryptographically signed setup link that Dr. Suresh can open to set his password in private.

---

## 3. Role-Based Access Control (RBAC) Matrix

| Permission | Administrator | Receptionist | Dentist / Surgeon | Accounts & Billing |
|---|:---:|:---:|:---:|:---:|
| **Appointments: View** | ✅ | ✅ | ✅ | ✅ |
| **Appointments: Create / Book** | ✅ | ✅ | ❌ | ❌ |
| **Appointments: Reschedule / Cancel** | ✅ | ✅ | ❌ | ❌ |
| **Appointments: Patient Check-In** | ✅ | ✅ | ✅ | ❌ |
| **Patients: View Registry** | ✅ | ✅ | ✅ | ✅ (Billing only) |
| **Patients: Register / Edit Demographics** | ✅ | ✅ | ❌ | ❌ |
| **Patients: Clinical Notes & Periodontal Charting** | ✅ | ❌ | ✅ | ❌ |
| **Billing: View Invoices & Receipts** | ✅ | ✅ | ✅ | ✅ |
| **Billing: Create Invoices** | ✅ | ✅ | ❌ | ✅ |
| **Billing: Record Authorized Payments** | ✅ | ✅ | ❌ | ✅ |
| **Billing: Financial & Collection Reports** | ✅ | ❌ | ❌ | ✅ |
| **Services: View Catalogue** | ✅ | ✅ | ✅ | ✅ |
| **Services: Modify Procedures / Fee Schedule** | ✅ | ❌ | ❌ | ❌ |
| **Team: Provision / Deactivate Staff Accounts** | ✅ | ❌ | ❌ | ❌ |
| **Settings: Clinic Configuration** | ✅ | ❌ | ❌ | ❌ |
| **Audit Logs: View Immutable Trail** | ✅ | ❌ | ❌ | ❌ |

---

## 4. Deploying Firestore Security Rules & Indexes

Deploy the security rules and query indexes directly to your Firebase project:

```bash
# 1. Log in to Firebase CLI
firebase login

# 2. Deploy Firestore rules and indexes
firebase deploy --only firestore
```

The rules enforce:
- User authentication and active status verification against `/staff/{request.auth.uid}`.
- Immutable payment records (payments cannot be altered or deleted after receipt generation).
- Immutable audit trail entries (append-only).
- Strict role verification before creating or modifying invoices, patient records, or staff profiles.

---

## 5. Deploying Cloud Functions

For server-side privileged staff management (provisioning new staff, updating status, revoking tokens):

```bash
# 1. Change to functions directory and install dependencies
cd functions
pnpm install

# 2. Build TypeScript
pnpm run build

# 3. Deploy functions
firebase deploy --only functions
```

---

## 6. Staff Login & Verification

Once deployed:
1. Navigate to the staff portal at `/staff/login`.
2. Authorised staff log in with their clinic email and password.
3. Upon authentication, users are redirected to `/staff/dashboard`.
4. Any attempt to access unauthorized sections (e.g. Receptionist navigating to `/staff/team` or `/staff/settings`) triggers the **Access Restricted** barrier.

