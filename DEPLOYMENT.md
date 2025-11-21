# Vercel Deployment Guide for StudyFlow

## 🚨 Critical: Environment Variables Required

The app is currently deployed but failing with 500 errors because **environment variables are missing**.

### Steps to Fix Deployment:

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/gorgojomagneto3-dot/enginnering/settings/environment-variables
   ```

2. **Add these 3 REQUIRED variables:**

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `MONGODB_URI` | `mongodb+srv://Unimarket:root@cluster0.yhrjd.mongodb.net/studyflow?retryWrites=true&w=majority` | Production, Preview, Development |
   | `NEXTAUTH_SECRET` | `studyflow-secret-key-2025-change-in-production` | Production, Preview, Development |
   | `NEXTAUTH_URL` | `https://enginnering-jet.vercel.app` | Production |

3. **Optional OAuth Providers (add if you want Google/GitHub login):**

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | Production, Preview, Development |
   | `GOOGLE_CLIENT_SECRET` | Your Google OAuth Secret | Production, Preview, Development |
   | `GITHUB_ID` | Your GitHub OAuth App ID | Production, Preview, Development |
   | `GITHUB_SECRET` | Your GitHub OAuth Secret | Production, Preview, Development |

4. **Redeploy:**
   - Go to: https://vercel.com/gorgojomagneto3-dot/enginnering
   - Click "Deployments" tab
   - Click the 3 dots (...) on the latest deployment
   - Select "Redeploy"

### Alternative: Push to trigger auto-deploy

```powershell
git add .
git commit -m "Fix: Update NotesEditor to use MongoDB API"
git push origin main
```

## ✅ What's Fixed

- **NotesEditor**: Now uses MongoDB API instead of localStorage
- **Auth Configuration**: Made resilient to missing OAuth credentials
- **Error Handling**: Better error messages for missing environment variables
- **Build**: Compiles successfully with all components connected to MongoDB

## 🔍 Verify Deployment

After adding environment variables and redeploying:

1. Visit: https://enginnering-jet.vercel.app
2. Create an account (email/password works without OAuth setup)
3. Test creating tasks, subjects, and notes
4. Data should persist in MongoDB Atlas

## 📝 Current Status

- ✅ App builds successfully
- ✅ All API routes created
- ✅ MongoDB models configured
- ✅ Frontend components connected to APIs
- ❌ Environment variables missing on Vercel (YOU NEED TO ADD THESE)
