# Pre-Deployment Checklist ✅

Use this checklist to ensure everything is ready before your first deployment.

## 🔍 Before You Start

- [ ] I have a Google Cloud Platform account
- [ ] I have a GitHub account and repository
- [ ] My project code is ready and tested locally

## 🏗️ Google Cloud Setup

- [ ] Created or selected a GCP project
- [ ] Noted down my **Project ID** (will be used in GitHub secrets)
- [ ] Enabled billing on my project
- [ ] Enabled these APIs:
  - [ ] Cloud Functions API
  - [ ] Cloud Build API

## 🔑 Service Account Setup

- [ ] Created service account named `github-actions-deployer`
- [ ] Assigned required roles:
  - [ ] Cloud Functions Admin
  - [ ] Cloud Build Editor  
  - [ ] Storage Admin
  - [ ] Service Account User
- [ ] Downloaded JSON key file
- [ ] **Confirmed JSON key file is NOT in my Git repository**

## 🔐 GitHub Secrets Configuration

- [ ] Added `GCP_PROJECT_ID` secret with my project ID
- [ ] Added `GCP_SA_KEY` secret with complete JSON file contents
- [ ] Double-checked both secrets are saved correctly

## 📝 Repository Setup

- [ ] All code is committed to Git
- [ ] Pushed to `main` or `master` branch
- [ ] GitHub Actions workflow file is in `.github/workflows/`

## 🧪 Ready to Deploy!

Once all items above are checked:

1. Push your code: `git push origin main`
2. Go to GitHub > Your Repository > Actions tab
3. Watch your deployment in real-time
4. Check the logs if anything fails

## 📞 Need Help?

If deployment fails:
1. Check the GitHub Actions logs for error messages
2. Verify all secrets are set correctly
3. Ensure GCP APIs are enabled
4. Check service account permissions

## 🎯 After Successful Deployment

Your function will be available at:
```
https://{region}-{project-id}.cloudfunctions.net/{function-name}/
```

Test endpoints:
- `GET /` - Health check
- `GET /api/hello?name=Test` - Hello API
- `POST /api/data` - Data processing API

---

**🚀 Ready? Let's deploy!**
