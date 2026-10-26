# Automatic Firebase Hosting Deployment via GitHub Actions
## Dr. R. Suresh Dental Clinic & Implant Centre

This project is configured with GitHub Actions to **automatically build and deploy to Firebase Hosting every time you commit and push to your `main` branch**.

---

## 1. How the GitHub Action Workflow Works

We have created two workflows in `.github/workflows/`:
1. [`.github/workflows/firebase-hosting-merge.yml`](file:///Users/balaji/Documents/Suresh-Dental-Clinic/.github/workflows/firebase-hosting-merge.yml)
   - Triggers on every `push` to `main` (or `master`).
   - Sets up Node.js 20 & pnpm 9.
   - Installs dependencies and runs `pnpm build` (exporting static files to `out/`).
   - Deploys to Firebase Hosting on the **live** channel.
2. [`.github/workflows/firebase-hosting-pull-request.yml`](file:///Users/balaji/Documents/Suresh-Dental-Clinic/.github/workflows/firebase-hosting-pull-request.yml)
   - Triggers on every pull request.
   - Builds and deploys a temporary **preview channel** URL so you can preview changes before merging.

---

## 2. Setting Up the Firebase Secret in GitHub (One-Time Setup)

GitHub Actions needs permission to deploy to your Firebase project. You can set this up using either Method A (Automated CLI) or Method B (Manual Console).

### Method A: Automated Setup via Firebase CLI (Recommended)

1. Open your terminal in this repository folder:
   ```bash
   cd /Users/balaji/Documents/Suresh-Dental-Clinic
   ```
2. Log in to Firebase:
   ```bash
   firebase login
   ```
3. Run the GitHub integration wizard:
   ```bash
   firebase init hosting:github
   ```
4. Follow the interactive prompts:
   - For repository name: enter `Balajiraju24/Suresh-Dental-Clinic`
   - Set up the workflow to run a build script before every deploy? **Yes**
   - What script should be run before every deploy? **pnpm install --frozen-lockfile && pnpm build**
   - Set up automatic deployment to your site's live channel when a PR is merged? **Yes**
   - What is the name of the GitHub branch associated with your site's live channel? **main**

*Firebase will automatically generate the required service account key and add the secret to your GitHub repository!*

---

### Method B: Manual Setup (Via Google Cloud / GitHub Web UI)

If you prefer to configure it manually:

1. **Create or select your Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/) and note your Project ID (e.g. `suresh-dental-clinic` or your chosen name).
2. **Generate a Service Account Key**:
   - In Firebase Console, click the gear icon &rarr; **Project settings** &rarr; **Service accounts** tab.
   - Click **Generate new private key** (or go to [Google Cloud IAM Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts), select the `firebase-adminsdk` or create a new service account with the `Firebase Hosting Admin` role, and click **Keys** &rarr; **Add Key** &rarr; **Create new key** &rarr; **JSON**).
   - Download the JSON key file.
3. **Add the Secret to GitHub**:
   - Go to your GitHub repository: [https://github.com/Balajiraju24/Suresh-Dental-Clinic](https://github.com/Balajiraju24/Suresh-Dental-Clinic)
   - Click **Settings** &rarr; **Secrets and variables** &rarr; **Actions**.
   - Click **New repository secret**.
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: Paste the **entire JSON file content** that you downloaded.
   - (Optional) If your Firebase project ID is different from `.firebaserc`, add another secret: `FIREBASE_PROJECT_ID` with your actual project ID.

---

## 3. Pushing Your Code to GitHub

Once you're ready to deploy:

```bash
# 1. Stage all project files including GitHub Actions workflows
git add .

# 2. Commit the changes
git commit -m "feat: complete dental clinic website with automated Firebase deployment"

# 3. Push to your GitHub repository
git push -u origin main
```

As soon as `git push` completes:
1. Navigate to the **Actions** tab in your GitHub repository:
   [https://github.com/Balajiraju24/Suresh-Dental-Clinic/actions](https://github.com/Balajiraju24/Suresh-Dental-Clinic/actions)
2. You will see the **"Deploy to Firebase Hosting on Merge / Push"** workflow running.
3. Once completed (typically 1–2 minutes), your website will be live on Firebase Hosting!

---

## 4. Custom Domain Setup (When Ready)

Once the clinic confirms their custom domain (e.g. `sureshdental.clinic`):
1. In Firebase Console, go to **Hosting** &rarr; **Add custom domain**.
2. Enter the domain and copy the DNS `A` / `TXT` records.
3. Update DNS at your domain registrar.
4. Firebase will automatically issue a free SSL certificate.

---

## 5. Troubleshooting: IAM & Service Usage Permissions

If your GitHub Action deployment encounters HTTP 403 `Permission denied to get service [firebasehosting.googleapis.com]` with `serviceusage.services.get`:

1. Open [Google Cloud IAM](https://console.cloud.google.com/iam-admin/iam?project=401764930609).
2. Edit the service account used for GitHub Actions and ensure these roles are assigned:
   - **Service Usage Consumer** (`roles/serviceusage.serviceUsageConsumer`)
   - **Firebase Hosting Admin** (`roles/firebasehosting.admin`)
3. Ensure the [Firebase Hosting API](https://console.cloud.google.com/apis/library/firebasehosting.googleapis.com?project=401764930609) is enabled.

