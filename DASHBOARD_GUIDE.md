# Balochistan RUMI Teachers Dashboard

## Overview
This is a **live-updating dashboard** for tracking engagement metrics of 37 Balochistan teachers using the Rumi platform.

## Features

### 📊 Real-Time Metrics
- **Engagement Distribution**: Pie chart showing highly active, recently active, moderately active, and dormant users
- **Feature Usage**: Bar chart showing adoption of lessons, coaching, reading assessments, videos, and image analysis
- **Conversion Funnel**: Visual funnel from onboarded → messaging → frequent users → feature users
- **User Leaderboard**: Top 10 users ranked by engagement with detailed activity breakdown

### 🎯 Engagement Categories
- **Highly Active**: Active in last 7 days with 5+ messages
- **Recently Active**: Active in last 7 days with <5 messages  
- **Moderately Active**: Last activity 7-14 days ago
- **Dormant**: Inactive for 14+ days

### 📈 Data Sources
- **Database**: Supabase PostgreSQL (configured in `.env.local`)
- **Users Tracked**: 37 Balochistan winter school cohort teachers
- **Refresh Rate**: Live data every 30 seconds
- **API Endpoint**: `/api/stats`

## Local Development

### Prerequisites
- Node.js 18+
- Environment variables in `.env.local` (already configured with Supabase)

### Running the Dashboard

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

The dashboard will automatically fetch live data from your Supabase database.

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Balochistan dashboard with live metrics"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Set Environment Variables in Vercel**
   - In project settings → "Environment Variables"
   - Add these from your `.env.local`:
     - `DB_HOST`
     - `DB_PORT`
     - `DB_NAME`
     - `DB_USER`
     - `DB_PASSWORD`
     - `NEXT_PUBLIC_API_URL` (set to your Vercel domain, e.g., `https://your-dashboard.vercel.app`)

4. **Deploy**
   - Vercel will automatically build and deploy on every push to main

### Deploy to Other Platforms

**Netlify**:
- Connect your GitHub repo
- Set environment variables in Build & Deploy settings
- Deploy with `npm run build && npm start`

**AWS/GCP/Docker**:
- Build: `npm run build`
- Start: `npm start`
- Ensure all environment variables are set in production

## Architecture

```
/pages
  ├── index.js              → Main dashboard page
  ├── _app.js               → Next.js app wrapper
  └── /api
      ├── stats.js          → Fetches live data from Supabase
      └── health.js         → Health check endpoint

/src/components
  └── BalochistanDashboard.jsx  → React component with Chart.js visualizations

/styles
  └── globals.css           → Dashboard styles (responsive, modern UI)
```

## API Reference

### GET `/api/stats`
Returns live engagement metrics for Balochistan cohort.

**Response**:
```json
{
  "timestamp": "2026-04-09T14:30:00Z",
  "breakdown": {
    "highlyActive": 2,
    "recentlyActive": 1,
    "moderatelyActive": 1,
    "dormant": 33,
    "total": 37
  },
  "funnel": {
    "onboarded": 37,
    "messagedOnce": 30,
    "messageFrequent": 5,
    "featureUsers": 3
  },
  "aggregateFeatures": {
    "totalMessages": 207,
    "totalLessonPlans": 4,
    "totalCoaching": 0,
    "totalReading": 0,
    "totalVideos": 0,
    "totalImages": 22
  },
  "userStats": [
    {
      "phone": "923468319667",
      "name": "Teacher Name",
      "messages": 137,
      "lessonPlans": 3,
      "coachingSessions": 0,
      "readingAssessments": 0,
      "videoRequests": 0,
      "imageAnalyses": 22,
      "lastActivity": "2026-04-09T12:00:00Z",
      "daysSinceLastActivity": 1,
      "status": "HIGHLY ACTIVE"
    }
  ]
}
```

## Customization

### Change Refresh Rate
In `src/components/BalochistanDashboard.jsx`, line 29:
```jsx
const interval = setInterval(fetchStats, 30000); // Change 30000 to desired milliseconds
```

### Track Different Users
In `pages/api/stats.js`, modify the `COHORT_PHONES` array to include different phone numbers.

### Customize Colors
Colors are defined in `styles/globals.css`:
- Primary: `#667eea`
- Secondary: `#764ba2`
- Success: `#10b981`
- Warning: `#f59e0b`
- Info: `#3b82f6`
- Error: `#ef4444`

## Troubleshooting

### Dashboard shows "Error" or "No data available"
1. Check that `.env.local` has correct Supabase credentials
2. Verify Supabase database is accessible
3. Check browser console for error messages
4. Test API: `curl http://localhost:3000/api/stats`

### Build errors
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

### SSL certificate errors in production
The Supabase connection uses `ssl: { rejectUnauthorized: false }` for flexibility, but consider using proper certificates in production.

## Performance Notes

- Dashboard data is computed real-time from Supabase queries
- Queries are optimized to run in parallel
- Chart.js renders efficiently for 37 users
- Refresh interval is 30 seconds (adjustable based on needs)

## Security

⚠️ **Important**: Your `.env.local` contains database credentials. 
- **Never commit** this file to version control
- It's in `.gitignore` by default
- In production (Vercel), set variables in project settings
- Consider using read-only database user for dashboard queries

## Next Steps

1. **Push to production**: Follow the Vercel deployment steps above
2. **Share dashboard**: Send the public URL to stakeholders
3. **Monitor metrics**: Check dashboard daily for engagement insights
4. **Iterate**: Based on insights, consider:
   - Creating engagement campaigns for dormant users
   - Analyzing why certain features aren't being adopted
   - Celebrating highly active users and their patterns

---

**Dashboard Built**: April 2026  
**Cohort Size**: 37 Balochistan teachers  
**Data Source**: Supabase PostgreSQL  
**Tech Stack**: Next.js 14, React 18, Chart.js, TailwindCSS
