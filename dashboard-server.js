// Live Dashboard Backend Server
// Streams engagement data from Rumi database every 5-10 seconds

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'analyst.jlpenspfdcwxkopaidys',
  password: 'RumiAnalyst2026secure',
  ssl: { rejectUnauthorized: false },
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

// Balochistan cohort phones (37 teachers - March 17-20)
const COHORT_PHONES = [
  '923468319667', '923358763443', '923158471302', '923327973445',
  '923130821054', '923084180356', '923138719167', '923003886529',
  '923138408602', '923003833001', '923333034829', '923366041711',
  '923132601026', '923323402593', '923138347824', '923218119065',
  '923333089133', '923138639063', '923138293573', '923335760459',
  '923333573583', '923193232024', '923337851933', '923333231376',
  '923353886056', '923333809133', '923138103177', '923332408634',
  '923323274385', '923337946655', '923104154676', '923342893756',
  '923374403473', '923123691611', '923422042524', '923358775056',
  '923218137693'
];

// Engagement breakdown query
async function getEngagementStats() {
  const phonePlaceholders = COHORT_PHONES.map((_, i) => `$${i + 1}`).join(',');

  const query = `
    SELECT
      u.phone_number,
      u.first_name,
      COUNT(DISTINCT CASE WHEN c.role = 'user' THEN c.id END) as messages,
      COUNT(DISTINCT lpr.id) as lesson_plans,
      COUNT(DISTINCT cs.id) as coaching_sessions,
      COUNT(DISTINCT ra.id) as reading_assessments,
      COUNT(DISTINCT vr.id) as video_requests,
      COUNT(DISTINCT iar.id) as image_analyses,
      MAX(c.created_at) as last_activity
    FROM users u
    LEFT JOIN conversations c ON u.id = c.user_id
    LEFT JOIN lesson_plan_requests lpr ON u.id = lpr.user_id
    LEFT JOIN coaching_sessions cs ON u.id = cs.user_id
    LEFT JOIN reading_assessments ra ON u.id = ra.user_id
    LEFT JOIN video_requests vr ON u.id = vr.user_id
    LEFT JOIN image_analysis_requests iar ON u.id = iar.user_id
    WHERE u.phone_number IN (${phonePlaceholders})
    AND COALESCE(u.is_test_user, false) = false
    GROUP BY u.id, u.phone_number, u.first_name
    ORDER BY messages DESC
  `;

  const result = await pool.query(query, COHORT_PHONES);

  // Calculate engagement levels
  const now = new Date();
  const stats = result.rows.map(row => {
    const lastActivity = row.last_activity ? new Date(row.last_activity) : null;
    const daysSinceLastActivityMs = lastActivity ? now - lastActivity : null;
    const daysSinceLastActivity = daysSinceLastActivityMs ? Math.floor(daysSinceLastActivityMs / (1000 * 60 * 60 * 24)) : null;

    let status = 'DORMANT';
    if (daysSinceLastActivity !== null) {
      if (daysSinceLastActivity <= 7 && row.messages > 5) {
        status = 'HIGHLY ACTIVE';
      } else if (daysSinceLastActivity <= 7) {
        status = 'RECENTLY ACTIVE';
      } else if (daysSinceLastActivity <= 14) {
        status = 'MODERATELY ACTIVE';
      }
    }

    return {
      phone: row.phone_number,
      name: row.first_name || 'Unknown',
      messages: parseInt(row.messages) || 0,
      lessonPlans: parseInt(row.lesson_plans) || 0,
      coachingSessions: parseInt(row.coaching_sessions) || 0,
      readingAssessments: parseInt(row.reading_assessments) || 0,
      videoRequests: parseInt(row.video_requests) || 0,
      imageAnalyses: parseInt(row.image_analyses) || 0,
      lastActivity: lastActivity,
      daysSinceLastActivity: daysSinceLastActivity,
      status: status
    };
  });

  // Calculate breakdowns
  const breakdown = {
    highlyActive: stats.filter(s => s.status === 'HIGHLY ACTIVE').length,
    recentlyActive: stats.filter(s => s.status === 'RECENTLY ACTIVE').length,
    moderatelyActive: stats.filter(s => s.status === 'MODERATELY ACTIVE').length,
    dormant: stats.filter(s => s.status === 'DORMANT').length,
    total: stats.length
  };

  // Conversion funnel (rough estimate based on messages sent)
  const funnel = {
    onboarded: stats.length,
    messagedOnce: stats.filter(s => s.messages > 0).length,
    messageFrequent: stats.filter(s => s.messages > 5).length,
    featureUsers: stats.filter(s => (s.lessonPlans + s.imageAnalyses + s.coachingSessions) > 0).length
  };

  // Aggregate feature usage
  const aggregateFeatures = {
    totalMessages: stats.reduce((sum, s) => sum + s.messages, 0),
    totalLessonPlans: stats.reduce((sum, s) => sum + s.lessonPlans, 0),
    totalCoaching: stats.reduce((sum, s) => sum + s.coachingSessions, 0),
    totalReading: stats.reduce((sum, s) => sum + s.readingAssessments, 0),
    totalVideos: stats.reduce((sum, s) => sum + s.videoRequests, 0),
    totalImages: stats.reduce((sum, s) => sum + s.imageAnalyses, 0)
  };

  return {
    timestamp: new Date().toISOString(),
    breakdown,
    funnel,
    aggregateFeatures,
    userStats: stats
  };
}

// API Routes
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getEngagementStats();
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Live Dashboard Server running on http://localhost:${PORT}`);
});
