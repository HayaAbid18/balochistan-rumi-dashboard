# 🎓 Balochistan Live Engagement Dashboard

Real-time monitoring of the Balochistan winter school cohort's engagement with Rumi platform.

**Live Dashboard**: Coming soon on Vercel! 🚀

---

## 📊 What This Tracks

- **37 teachers** from March 17-20 onboarding cohort
- **Engagement levels**: Highly Active, Recently Active, Moderately Active, Dormant
- **Feature adoption**: Messages, Lesson Plans, Coaching, Reading Assessments, Videos, Image Analysis
- **Conversion funnel**: From onboarding → feature usage
- **Real-time updates** every 5 seconds

---

## 🏗️ Architecture

### Frontend (Next.js + React)
- Beautiful, responsive dashboard UI
- Real-time stat updates
- Conversion funnel visualization
- Feature usage aggregation
- Live user table

### Backend (Next.js API Routes)
- Serverless functions on Vercel
- PostgreSQL connection to Rumi database
- Fast data aggregation
- Automatic scaling

### Database
- Read-only access to Rumi production database
- Supabase PostgreSQL
- Secure credentials management

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local (copy from template)
cp .env.local.example .env.local

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

---

## 📦 Project Structure

```
.
├── pages/
│   ├── _app.js                 # Next.js wrapper
│   ├── index.js                # Dashboard page
│   └── api/
│       ├── stats.js            # Stats API endpoint
│       └── health.js           # Health check
├── src/
│   └── components/
│       ├── BalochistanDashboard.jsx    # Main component
│       └── BalochistanDashboard.css    # Styling
├── styles/
│   └── globals.css             # Global styles
├── package.json                # Dependencies
├── next.config.js              # Next.js config
├── vercel.json                 # Vercel config
└── .env.local                  # Environment variables (DO NOT COMMIT)
```

---

## 🌍 Deployment

### Deploy to Vercel (Recommended)

See **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** for complete step-by-step guide.

**TL;DR:**
1. Push code to GitHub
2. Connect to Vercel from vercel.com
3. Add environment variables
4. Deploy! ✨

### Deploy Elsewhere

Works with any Node.js hosting (Heroku, Render, AWS, etc.):

```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

**Never commit `.env.local`!** It contains database credentials.

Required variables:
```
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=analyst.jlpenspfdcwxkopaidys
DB_PASSWORD=RumiAnalyst2026secure
```

In production (Vercel), these are set in **Settings → Environment Variables** as secrets.

---

## 📈 Features

### Real-time Stats
- Updates every 5 seconds
- Live engagement breakdown
- Active user count
- Feature usage trends

### Engagement Breakdown
```
HIGHLY ACTIVE      2 teachers (5.4%)
RECENTLY ACTIVE    4 teachers (10.8%)
MODERATELY ACTIVE  0 teachers (0%)
DORMANT           31 teachers (83.8%)
```

### Conversion Funnel
```
Onboarded       → 37 (100%)
Sent Messages   →  6 (16%)
Frequent Users  →  3 (8%)
Feature Users   →  2 (5%)
```

### Feature Usage
```
Messages: 68
Lesson Plans: 12
Image Analyses: 7
Coaching: 0
Reading Assessments: 0
Videos: 0
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### API Endpoints

**GET /api/stats**
- Returns engagement stats for cohort
- Auto-computed metrics
- Real-time data

**GET /api/health**
- Health check endpoint
- Returns `{ ok: true, timestamp: ... }`

---

## 📊 Dashboard Sections

### Key Metrics Cards
- Cohort size
- % Highly Active
- % Recently Active
- % Dormant

### Engagement Breakdown Chart
Visual bars showing distribution across engagement levels.

### Conversion Funnel
Drop-off visualization from onboarding → feature adoption.

### Feature Usage Cards
Icon-based cards showing totals for each feature.

### Top 10 Users
Ranked by message count.

### Full User Table
All 37 teachers with engagement metrics, status, last activity.

---

## 🔍 Troubleshooting

### Dashboard not loading
- Check browser console for errors (F12)
- Verify `.env.local` has correct credentials
- Try `npm run dev` in terminal

### API returns errors
- Verify database is online
- Check credentials in `.env.local`
- Ensure IP whitelist allows your machine (or Vercel IPs)

### Slow performance
- Clear browser cache (Ctrl+Shift+Del)
- Check database query performance
- Try different browser

### Build fails on Vercel
- Check **Build Logs** in Vercel dashboard
- Verify all environment variables are set
- Ensure `package.json` has all dependencies

---

## 📚 Documentation

- **Setup**: See `.env.local` template
- **Deployment**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Database**: See `CLAUDE.md` for Rumi DB schema

---

## 👥 Team

Built for monitoring Balochistan winter school engagement with Rumi platform.

Data sources:
- Rumi production database (PostgreSQL via Supabase)
- 37 teachers from March 17-20 cohort

---

## 📜 License

Private project. Not for public distribution.

---

## 🤝 Contributing

To add features or fix bugs:

1. Create branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push to GitHub: `git push origin feature/your-feature`
4. Create Pull Request

---

## 📞 Support

- Check troubleshooting section
- Review [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for deployment issues
- Check build logs in Vercel dashboard

---

**Last Updated**: April 7, 2026
**Status**: ✅ Ready for deployment
