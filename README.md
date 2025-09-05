# GCP Cloud Functions Node.js with GitHub Actions

This project demonstrates how to deploy a Node.js application to Google Cloud Functions using GitHub Actions for CI/CD.

## Project Structure

```
gcp-cloud-functions-nodejs/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions workflow
├── src/
│   └── index.js            # Main Cloud Function file
├── tests/
│   └── app.test.js         # Test file
├── package.json            # Node.js dependencies
├── .gcloudignore           # Files to ignore during deployment
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Prerequisites

1. **Google Cloud Platform Account**
2. **GitHub Account**
3. **GCP Project with billing enabled**
4. **Required GCP APIs enabled:**
   - Cloud Functions API
   - Cloud Build API

## Setup Instructions

### 1. Enable Required GCP APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2. Create a Service Account

1. Go to the [GCP Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin > Service Accounts**
3. Click **Create Service Account**
4. Name: `github-actions-deployer`
5. Grant the following roles:
   - **Cloud Run Admin**
   - **Storage Admin** (for Container Registry)
   - **Service Account User**

### 3. Generate Service Account Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key > Create new key**
4. Choose **JSON** format
5. Download the key file

### 4. Configure GitHub Secrets

In your GitHub repository, go to **Settings > Secrets and variables > Actions** and add:

- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_SA_KEY`: The entire contents of the service account JSON key file

### 5. Local Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Test the endpoints
curl http://localhost:8080/
curl http://localhost:8080/api/hello?name=YourName
```

## API Endpoints

- `GET /` - Health check endpoint
- `GET /api/hello?name=YourName` - Greeting endpoint
- `POST /api/data` - Data processing endpoint

### Example Usage

```bash
# Health check
curl https://your-service-url.run.app/

# Greeting
curl https://your-service-url.run.app/api/hello?name=John

# Post data
curl -X POST https://your-service-url.run.app/api/data \
  -H "Content-Type: application/json" \
  -d '{"data": "test message"}'
```

## Deployment

The application automatically deploys to Cloud Run when you push to the `main` or `master` branch.

### Manual Deployment

If you need to deploy manually:

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/nodejs-cloudrun-function

# Deploy to Cloud Run
gcloud run deploy nodejs-cloudrun-function \
  --image gcr.io/YOUR_PROJECT_ID/nodejs-cloudrun-function \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Environment Variables

You can set environment variables in the GitHub Actions workflow or through the GCP Console:

- `NODE_ENV`: Set to `production` for production deployments
- `PORT`: Container port (default: 8080)

## Monitoring and Logs

- **Cloud Run Console**: Monitor your service performance
- **Cloud Logging**: View application logs
- **Cloud Monitoring**: Set up alerts and metrics

## Cost Optimization

The deployment is configured with:
- **Min instances**: 0 (scales to zero when not in use)
- **Max instances**: 10
- **Memory**: 512Mi
- **CPU**: 1

This configuration minimizes costs by scaling to zero during idle periods.

## Security Considerations

1. **Service Account**: Uses minimal required permissions
2. **Secrets Management**: Sensitive data stored in GitHub Secrets
3. **Container Security**: Uses non-root user in container
4. **Network**: Cloud Run handles HTTPS termination

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all required APIs are enabled
2. **Permission Denied**: Verify service account roles
3. **Container Won't Start**: Check that PORT=8080 is exposed
4. **Secrets Not Found**: Ensure GitHub secrets are properly set

### Debugging

```bash
# View Cloud Run logs
gcloud logs read --service=nodejs-cloudrun-function

# Check service status
gcloud run services describe nodejs-cloudrun-function --region=us-central1
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to your branch
5. Create a Pull Request

The GitHub Actions workflow will automatically test and deploy your changes when merged to main.

## License

MIT License - see LICENSE file for details.
