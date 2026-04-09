# Deploy Balochistan Dashboard to Railway

Railway is a modern cloud platform perfect for Node.js/Next.js applications. Your dashboard will be live in **5 minutes**.

## Prerequisites
- GitHub account with your repo pushed
- Railway account (free tier available) at [railway.app](https://railway.app)

## Step 1: Push Your Code to GitHub

```bash
cd c:/Users/Haya\ Abid/Documents/signup-flow

# Make sure everything is committed
git status

# Push to GitHub
git push origin main
```

## Step 2: Create Railway Account

1. Go to **[railway.app](https://railway.app)**
2. Click **"Start Your Project"**
3. Sign up with GitHub (easiest option)
4. Authorize Railway to access your repositories

## Step 3: Deploy Your Project

### Option A: Direct GitHub Connect (Recommended)

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your signup-flow repository
4. Click **"Deploy Now"**

Railway will automatically:
- Detect Next.js
- Run `npm install`
- Run `npm run build`
- Start the server with `npm start`

### Option B: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# In your project directory
railway init

# Deploy
railway up
```

## Step 4: Add Environment Variables

### Via Railway Dashboard (Easy)

1. Go to your Railway project
2. Click the **"Variables"** tab
3. Add these variables from your `.env.local`:

```
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=analyst.jlpenspfdcwxkopaidys
DB_PASSWORD=RumiAnalyst2026secure
NODE_ENV=production
```

⚠️ **Important**: In Railway's UI, you don't need `NEXT_PUBLIC_API_URL` - it auto-generates the public URL.

### Via Railway CLI

```bash
railway variable add DB_HOST aws-1-ap-southeast-1.pooler.supabase.com
railway variable add DB_PORT 5432
railway variable add DB_NAME postgres
railway variable add DB_USER analyst.jlpenspfdcwxkopaidys
railway variable add DB_PASSWORD RumiAnalyst2026secure
railway variable add NODE_ENV production
```

## Step 5: Configure Build Settings (Optional)

Railway auto-detects Next.js, but you can verify:

1. In your Railway project, click **"Settings"**
2. Under **"Build"**, verify:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `.` (root)
3. Click **"Deploy"** if changes were made

## Step 6: Get Your Dashboard URL

After deployment completes:

1. Go to the **"Deployments"** tab
2. Click on your active deployment
3. Your public URL appears at the top, like: `https://your-project-abc123.railway.app`

**Share this URL** with your team! 🎉

## Verify It's Working

```bash
# Test your dashboard
curl https://your-project-abc123.railway.app

# Check API endpoint
curl https://your-project-abc123.railway.app/api/stats
```

You should see:
- Dashboard loads with engagement metrics
- API returns live data from Supabase

## Railway Dashboard Features

### Monitor Logs
```
Click "Logs" tab → See real-time application logs
```

### View Metrics
```
"Metrics" tab → CPU, Memory, Network usage
```

### Redeploy
```
"Deployments" tab → Click redeploy button
```

### Custom Domain (Optional)
```
Settings → Add Custom Domain
```

## Troubleshooting

### "Build failed" Error

**Check logs**: Click "Logs" and look for error messages

**Common fixes**:
```bash
# Clear Next.js cache before pushing
rm -rf .next

# Ensure all dependencies are listed
npm install

# Commit and push
git add .
git commit -m "Fix build"
git push origin main
```

### "Cannot connect to database"

1. Verify environment variables are set in Railway
2. Check database credentials in `.env.local` are correct
3. Ensure Supabase allows connections from Railway's IP ranges
   - In Supabase: Settings → Database → Allowed connections
   - Select "Allow all IP addresses" (or add Railway's IPs)

### "Dashboard shows error loading data"

1. Check Railway logs for database errors
2. Verify API is returning data: `curl https://your-url/api/stats`
3. Check browser console for frontend errors

### Deployment stuck/freezing

```bash
# Via Railway CLI
railway cancel
railway up
```

## Update Your Dashboard

When you make changes:

```bash
# Make your changes
git add .
git commit -m "Update dashboard"
git push origin main
```

Railway automatically redeploys on every GitHub push! 🔄

## Railway Free Tier Limits

Your dashboard should fit comfortably in the free tier:
- **Memory**: 5GB/month shared
- **Bandwidth**: 100GB/month
- **Execution time**: Unlimited
- **Databases**: 1 free PostgreSQL instance (if using Railway DB)

Since you're using Supabase for the database, you're only using Railway for the app server, so you'll have **plenty of free resources**.

## Scaling (When You Need More)

If you reach limits, Railway offers:
- Pay-as-you-go pricing
- Auto-scaling
- Load balancing

Start: **$5/month** for increased resources

## Advanced: Custom Build Configuration

If needed, create `Procfile` in root:

```
web: npm start
```

Or use `railway.json` (already created in your project):

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 5
  }
}
```

## Monitoring Your Dashboard

### Set up Railway Alerts

1. Go to **Settings** → **Notifications**
2. Enable alerts for:
   - Build failures
   - Deployment failures
   - High memory/CPU usage

### View Dashboard Statistics

In Railway dashboard:
- Total requests
- Response times
- Error rates
- Network usage

## Next Steps

1. **Push code**: `git push origin main`
2. **Create Railway account**: [railway.app](https://railway.app)
3. **Connect GitHub repo**
4. **Add environment variables**
5. **Deploy** (takes 2-5 minutes)
6. **Share public URL** with your team

## Support

- **Railway Docs**: https://docs.railway.app
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Issues with Supabase**: https://supabase.com/docs

---

**Dashboard**: Balochistan RUMI Teachers  
**Hosting**: Railway  
**Framework**: Next.js 14  
**Database**: Supabase PostgreSQL  
**Estimated Deploy Time**: 3-5 minutes  
**Public URL Format**: `https://your-project-xxx.railway.app`
