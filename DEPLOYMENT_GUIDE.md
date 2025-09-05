# GitHub Actions Deployment Setup Guide

This guide will walk you through setting up GitHub Secrets and deploying your Cloud Function for the first time.

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] A Google Cloud Platform account
- [ ] A GCP project with billing enabled
- [ ] Your GitHub repository created
- [ ] Git installed on your machine

## 🔧 Step 1: Google Cloud Platform Setup

### 1.1 Create or Select a GCP Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Either select an existing project or click "New Project"
4. Note your **Project ID** (not the project name) - you'll need this later

### 1.2 Enable Billing

1. In the GCP Console, go to "Billing"
2. Link a billing account to your project
3. This is required for Cloud Functions deployment

### 1.3 Enable Required APIs

1. Go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Cloud Functions API**
   - **Cloud Build API**
   - **Cloud Storage API** (automatically enabled with Cloud Functions)

## 🔑 Step 2: Create Service Account

### 2.1 Create the Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Fill in the details:
   - **Name**: `github-actions-deployer`
   - **Description**: `Service account for GitHub Actions Cloud Functions deployment`
4. Click "Create and Continue"

### 2.2 Assign Roles

Assign these roles to your service account:
- **Cloud Functions Admin** (`roles/cloudfunctions.admin`)
- **Cloud Build Editor** (`roles/cloudbuild.builds.editor`)
- **Storage Admin** (`roles/storage.admin`)
- **Service Account User** (`roles/iam.serviceAccountUser`)

To add roles:
1. Click on your service account
2. Go to "IAM" tab
3. Click "Grant Access"
4. Add the service account email and assign each role

### 2.3 Generate Service Account Key

1. Go back to "Service Accounts"
2. Click on your `github-actions-deployer` service account
3. Go to "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Choose "JSON" format
6. Download the JSON file
7. **⚠️ IMPORTANT: Keep this file secure and never commit it to Git!**

## 🔐 Step 3: Configure GitHub Secrets

### 3.1 Access Repository Secrets

1. Go to your GitHub repository
2. Click "Settings" tab
3. In the left sidebar, click "Secrets and variables" > "Actions"

### 3.2 Add Required Secrets

Click "New repository secret" and add these two secrets:

#### Secret 1: GCP_PROJECT_ID
- **Name**: `GCP_PROJECT_ID`
- **Value**: Your Google Cloud Project ID (from Step 1.1)

#### Secret 2: GCP_SA_KEY
- **Name**: `GCP_SA_KEY`
- **Value**: The entire contents of the JSON file you downloaded in Step 2.3

**How to get the JSON contents:**
```bash
# On Windows (using notepad)
notepad path/to/your/service-account-key.json

# On Mac/Linux
cat path/to/your/service-account-key.json
```

Copy the entire JSON content (including the curly braces) and paste it as the secret value.

## 📤 Step 4: Deploy Your Function

### 4.1 Push to GitHub

1. Make sure your code is committed:
```bash
git add .
git commit -m "Initial Cloud Function setup"
```

2. Push to the main branch:
```bash
git push origin main
```

### 4.2 Monitor Deployment

1. Go to your GitHub repository
2. Click "Actions" tab
3. You should see your workflow running
4. Click on the workflow run to see detailed logs

### 4.3 Find Your Function URL

Once deployment succeeds:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "Cloud Functions"
3. Click on your function (`nodejs-hello-function`)
4. Find the "Trigger URL" - this is your function's public URL

## 🧪 Step 5: Test Your Function

Test these endpoints:
```bash
# Health check
curl https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/nodejs-hello-function/

# Hello endpoint
curl "https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/nodejs-hello-function/api/hello?name=YourName"

# Data endpoint
curl -X POST \
  https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/nodejs-hello-function/api/data \
  -H "Content-Type: application/json" \
  -d '{"data": "test message"}'
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Permission denied" errors**
   - Check that your service account has all required roles
   - Verify the JSON key is correct and complete

2. **"Project not found" errors**
   - Double-check your Project ID in GitHub secrets
   - Ensure billing is enabled on your project

3. **"API not enabled" errors**
   - Make sure all required APIs are enabled in GCP Console

4. **Workflow fails on "npm test"**
   - Check if all dependencies are properly installed
   - Verify your test files are correct

### Viewing Logs:

- **GitHub Actions logs**: Repository > Actions > Click on workflow run
- **Cloud Function logs**: GCP Console > Cloud Functions > Function name > Logs

## 🎉 Success!

Once your workflow completes successfully:
- Your function will be deployed and accessible via HTTPS
- Future pushes to main/master will automatically redeploy
- You can monitor function performance in the GCP Console

## 🔄 Next Steps

Consider these improvements:
- Set up staging/production environments
- Add monitoring and alerting
- Implement proper error handling
- Add authentication if needed

---

**Remember**: Never commit your service account JSON file to Git. Always use GitHub Secrets for sensitive information!
