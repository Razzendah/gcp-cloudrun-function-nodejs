# Step-by-Step Setup Guide for GCP Cloud Run with GitHub Actions

## 1. GCP Project Setup

### Create a new GCP Project (if needed)
1. Go to [GCP Console](https://console.cloud.google.com/)
2. Click on the project dropdown
3. Click "New Project"
4. Enter project name and select billing account
5. Note your Project ID (you'll need this later)

### Enable Required APIs
Run these commands in Google Cloud Shell or locally with gcloud CLI:

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

## 2. Service Account Creation

### Method 1: Using GCP Console (Recommended for beginners)

1. **Navigate to IAM & Admin**
   - Go to [GCP Console](https://console.cloud.google.com/)
   - Select your project
   - Navigate to "IAM & Admin" > "Service Accounts"

2. **Create Service Account**
   - Click "CREATE SERVICE ACCOUNT"
   - **Name**: `github-actions-deployer`
   - **Description**: `Service account for GitHub Actions deployment`
   - Click "CREATE AND CONTINUE"

3. **Grant Roles**
   Add these roles one by one:
   - `Cloud Run Admin`
   - `Storage Admin`
   - `Service Account User`
   
   Click "CONTINUE" then "DONE"

4. **Create JSON Key**
   - Click on the created service account
   - Go to "KEYS" tab
   - Click "ADD KEY" > "Create new key"
   - Select "JSON" format
   - Click "CREATE" - file will download automatically
   - **IMPORTANT**: Keep this file secure and never commit to git!

### Method 2: Using Command Line

```bash
# Create service account
gcloud iam service-accounts create github-actions-deployer \
    --description="Service account for GitHub Actions deployment" \
    --display-name="GitHub Actions Deployer"

# Grant necessary roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions-deployer@$PROJECT_ID.iam.gserviceaccount.com
```

## 3. GitHub Repository Setup

### Create Repository
1. Create a new repository on GitHub
2. Clone or push your code to the repository

### Add GitHub Secrets
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Navigate to "Secrets and variables" > "Actions"
4. Click "New repository secret" for each:

**Required Secrets:**
- **Name**: `GCP_PROJECT_ID`
  **Value**: Your GCP project ID (e.g., `my-project-123456`)

- **Name**: `GCP_SA_KEY`
  **Value**: The entire contents of the downloaded JSON key file
  (Open the JSON file in a text editor and copy ALL content including braces)

## 4. Local Development Setup

```bash
# Clone your repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Run locally for testing
npm run dev

# Test endpoints
curl http://localhost:8080/
curl http://localhost:8080/api/hello?name=YourName
```

## 5. Deployment

### Automatic Deployment
Simply push to the main branch:

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

The GitHub Action will automatically:
1. Build your Docker container
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Test the deployment

### Monitor Deployment
1. Go to your GitHub repository
2. Click "Actions" tab
3. Watch the deployment progress
4. Once complete, the service URL will be displayed in the logs

## 6. Verification

### Check Cloud Run Service
1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. You should see your `nodejs-cloudrun-function` service
3. Click on it to see details and get the service URL

### Test Your API
```bash
# Replace YOUR_SERVICE_URL with the actual URL from Cloud Run
curl https://YOUR_SERVICE_URL.run.app/
curl https://YOUR_SERVICE_URL.run.app/api/hello?name=Test
```

## 7. Common Issues & Solutions

### Issue: "Permission denied" during deployment
**Solution**: Verify service account has all required roles

### Issue: "API not enabled"
**Solution**: Ensure all required APIs are enabled:
```bash
gcloud services list --enabled
```

### Issue: GitHub Action fails at authentication
**Solution**: 
- Verify `GCP_SA_KEY` secret contains the complete JSON key
- Check `GCP_PROJECT_ID` matches your actual project ID

### Issue: Container fails to start
**Solution**: 
- Ensure your app listens on port 8080
- Check application logs in Cloud Run console

## 8. Cost Management

### Monitor Costs
- Cloud Run charges only for actual usage
- With min-instances=0, it scales to zero when idle
- Monitor costs in [GCP Billing Console](https://console.cloud.google.com/billing)

### Set Budget Alerts
1. Go to Billing > Budgets & alerts
2. Create a budget for your project
3. Set alerts at 50%, 90%, and 100% of budget

## 9. Security Best Practices

✅ **Do's:**
- Keep service account keys secure
- Use GitHub Secrets for sensitive data
- Regularly rotate service account keys
- Monitor IAM permissions

❌ **Don'ts:**
- Never commit service account keys to git
- Don't grant overly broad permissions
- Don't share service account keys

## 10. Next Steps

Once your basic setup is working:

1. **Add Environment Variables**: Configure different environments (dev, staging, prod)
2. **Implement Logging**: Add structured logging with Cloud Logging
3. **Add Monitoring**: Set up Cloud Monitoring and alerting
4. **Database Integration**: Connect to Cloud SQL, Firestore, etc.
5. **Custom Domain**: Set up a custom domain for your service
6. **CI/CD Improvements**: Add testing, linting, and security scanning

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Review Cloud Run logs in GCP Console
3. Verify all APIs are enabled
4. Double-check service account permissions

Remember to replace placeholder values (like `your-project-id`, `your-username`, etc.) with your actual values!
