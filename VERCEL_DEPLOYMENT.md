# 🚀 Deploy Balochistan Dashboard to Vercel

Complete step-by-step guide to deploy the live engagement dashboard on Vercel.

## ✨ What You'll Get

- **Automatic deployment** from GitHub
- **Serverless API** (no server to manage)
- **Global CDN** (fast loading worldwide)
- **Free tier** available (perfect for testing)
- **Environment variables** managed securely
- **Real-time updates** every 5 seconds

---

## 📋 Prerequisites

1. GitHub account (to host your code)
2. Vercel account (free signup at vercel.com)
3. The dashboard code ready to go

---

## 🔧 Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
# Initialize git repo (if not already done)
cd /c/Users/Haya\ Abid/Documents/signup-flow
git init
git add .
git commit -m "Initial dashboard setup"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/balochistan-dashboard.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

### Step 2: Connect to Vercel

1. Go to **vercel.com** and sign up with GitHub
2. Click **New Project**
3. Select your `balochistan-dashboard` repository
4. Framework: **Next.js** (auto-detected)
5. Click **Deploy**

---

### Step 3: Add Environment Variables

⚠️ **IMPORTANT**: Never commit `.env.local` to GitHub!

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Variable | Value |
|----------|-------|
| `DB_HOST` | `aws-1-ap-southeast-1.pooler.supabase.com` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `postgres` |
| `DB_USER` | `analyst.jlpenspfdcwxkopaidys` |
| `DB_PASSWORD` | `RumiAnalyst2026secure` |

4. Make sure **DB_PASSWORD** is marked as **Secret** ✓
5. Click **Save**

---

### Step 4: Configure Production Domain

Optional: Set up a custom domain

1. In Vercel dashboard, go to **Domains**
2. Add your domain (e.g., `balochistan-dashboard.yourcompany.com`)
3. Update DNS records as shown
4. Vercel automatically handles SSL

---

### Step 5: Verify Deployment

1. Go to your Vercel deployment URL (e.g., `https://balochistan-dashboard.vercel.app`)
2. You should see the live dashboard loading
3. Check **Deployments** tab for build status

---

## 🧪 Testing

```bash
# Test locally first before deploying
npm install
npm run dev

# Visit http://localhost:3000
```

---

## 📊 Dashboard Features

✅ Real-time updates every 5 seconds
✅ 37 Balochistan teachers tracked
✅ Engagement breakdown (Active/Dormant)
✅ Conversion funnel visualization
✅ Feature usage aggregation
✅ Live user table with stats
✅ Responsive design (mobile-friendly)

---

## 🔐 Security Best Practices

1. ✅ Database password stored as **Secret** in Vercel
2. ✅ Never commit `.env.local` to GitHub
3. ✅ Use `.gitignore`:

```
.env.local
.env.*.local
node_modules/
.next/
out/
build/
*.log
```

4. ✅ Consider IP whitelisting for Supabase if possible

---

## 📈 Monitoring & Logs

### View Real-time Logs

In Vercel dashboard:
1. Click **Deployments**
2. Click latest deployment
3. Click **View Logs**
4. Watch real-time requests and errors

### Check API Health

```bash
# Test health endpoint
curl https://YOUR_DEPLOYMENT.vercel.app/api/health
```

Should return:
```json
{
  "ok": true,
  "timestamp": "2026-04-07T...",
  "environment": "production"
}
```

### Test Stats API

```bash
curl https://YOUR_DEPLOYMENT.vercel.app/api/stats
```

Should return full engagement data.

---

## 🚨 Troubleshooting

### Build fails
```
Error: Cannot find module 'pg'
```
**Solution**: Dependencies auto-installed. Check `build logs` in Vercel dashboard.

### Dashboard shows error
**Check**:
1. Are environment variables set in Vercel?
2. Is database connection working? (`/api/health` should work)
3. Check Vercel logs for details

### API returns 500
**Check**:
1. Database credentials are correct
2. IP whitelist allows Vercel's IPs (Supabase)
3. Database is online and accessible

### Slow loading
**Check**:
1. Vercel region (should auto-optimize)
2. Database query performance
3. Network latency

---

## 🔄 Continuous Deployment

Every time you push to GitHub:

```bash
git commit -m "Update dashboard"
git push origin main
```

Vercel **automatically deploys** the new version! 🎉

---

## 💰 Pricing

| Tier | Cost | For |
|------|------|-----|
| **Free** | $0 | Development/testing |
| **Pro** | $20/mo | Production dashboards |
| **Enterprise** | Custom | Large-scale deployments |

Free tier is perfect for this dashboard!

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Troubleshooting**: Check Vercel dashboard logs

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] Dashboard loads at https://YOUR_DEPLOYMENT.vercel.app
- [ ] Real-time data updates working
- [ ] API health check working
- [ ] No errors in console

---

## 🎉 You're Live!

Your Balochistan engagement dashboard is now **live on Vercel**!

Share the URL with stakeholders to monitor cohort engagement in real-time.
