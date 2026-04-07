# 🎓 Balochistan Live Engagement Dashboard

Real-time monitoring of the March 17 Balochistan winter school cohort (37 teachers).

## ✨ Features

- **Real-time updates** every 5 seconds
- **Engagement breakdown** (Highly Active, Recently Active, Moderately Active, Dormant)
- **Conversion funnel** tracking from onboarding → feature adoption
- **Feature usage** aggregation (Messages, Lesson Plans, Coaching, etc.)
- **Live user table** with individual engagement metrics
- **Beautiful React UI** with live refresh

## 📋 Setup Instructions

### 1. Install Backend Dependencies

```bash
npm install express pg cors
```

### 2. Create `.env` file (optional for future credentials rotation)

```bash
# .env
PORT=3001
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_USER=analyst.jlpenspfdcwxkopaidys
DB_PASSWORD=RumiAnalyst2026secure
```

### 3. Start the Backend Server

```bash
node dashboard-server.js
```

You should see:
```
Live Dashboard Server running on http://localhost:3001
```

### 4. Update React App

In your React app, import the dashboard:

```jsx
// In src/App.jsx
import BalochistanDashboard from './components/BalochistanDashboard';

function App() {
  return <BalochistanDashboard />;
}

export default App;
```

### 5. Start React App

```bash
npm start
```

Dashboard will be available at `http://localhost:3000`

---

## 📊 Dashboard Sections

### Metrics Cards
- **Cohort Size**: Total 37 teachers (March 17-20 signups only)
- **Highly Active**: >5 messages, active in last 7 days
- **Recently Active**: Any activity in last 7 days
- **Dormant**: Inactive >14 days

### Engagement Breakdown
Visual bar chart showing % of teachers in each engagement tier.

### Conversion Funnel
Shows drop-off from:
1. **Onboarded** (37 teachers)
2. **Sent 1+ Messages**
3. **Frequent Users** (5+ messages)
4. **Feature Users** (used LP, Coaching, Reading, etc.)

### Feature Usage
Aggregate counts across all cohort members:
- Messages sent
- Lesson plans created
- Coaching sessions started
- Reading assessments completed
- Videos generated
- Image analyses submitted

### Top 10 Most Active Users
Ranked by message count.

### Full Users Table
All 37 teachers with:
- Phone number
- Message count
- Lesson plans created
- Image analyses
- Current status
- Last activity date

---

## 🔄 Refresh Rate

Auto-refreshes every **5 seconds** to show live engagement data.

Can be changed in `BalochistanDashboard.jsx`:
```jsx
const interval = setInterval(fetchStats, 5000); // Change 5000ms
```

---

## 🎯 Key Metrics to Watch

| Metric | Current Value | Target | Status |
|--------|---------------|--------|--------|
| Onboarded | 37 | 85 | ⚠️ 43.5% |
| Highly Active | ? | >15% | TBD |
| Message Adoption | ? | >70% | TBD |
| Feature Adoption | ? | >25% | TBD |

---

## 📱 Troubleshooting

### "Cannot connect to database"
- Verify internet connection
- Check credentials in `dashboard-server.js`
- Ensure Supabase IP is whitelisted

### "API not found"
- Ensure backend server is running (`node dashboard-server.js`)
- Check that backend is on port 3001
- Verify `.env` or hardcoded credentials

### Dashboard shows old data
- Check browser console for errors
- Verify frontend is fetching from correct API URL
- Check network tab to see API requests

---

## 🚀 Future Enhancements

- [ ] Export CSV/JSON of engagement data
- [ ] Week-over-week comparison charts
- [ ] Cohort comparison (March 17 vs March 18-20 vs new signups)
- [ ] Drill-down into individual user journey
- [ ] Slack notifications for new feature users
- [ ] Email weekly digest to stakeholders

---

## 📞 Support

For questions or issues, contact the development team.
