import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

// Filtered cohort: Teachers from the official March 17th cohort list
// Excludes internal/test users:
// - 923351940976 (Alishba)
// - 923348635352 (Mahnoor)
const COHORT_PHONES = [
  '923003833001',  '923003886529',  '923013772159',  '923058053829',  '923084180356',
  '923104154676',  '923110067199',  '923117469641',  '923123691611',  '923128656305',
  '923130821054',  '923132601026',  '923138103177',  '923138293573',  '923138347824',
  '923138366526',  '923138408602',  '923138639063',  '923138719167',  '923138775231',
  '923150377118',  '923158020406',  '923158471302',  '923168052728',  '923168754009',
  '923171280012',  '923180001644',  '923183963107',  '923187751850',  '923193232024',
  '923218119065',  '923218137693',  '923246994366',  '923273175877',  '923312159674',
  '923316801661',  '923317170188',  '923318013708',  '923318381061',  '923321744861',
  '923323274385',  '923323402593',  '923327821014',  '923327850957',  '923327973445',
  '923330036176',  '923330760276',  '923332408634',  '923333034829',  '923333089133',
  '923333231376',  '923333441551',  '923333543930',  '923333572105',  '923333573583',
  '923333809133',  '923335760459',  '923337812223',  '923337851933',  '923337872446',
  '923337946655',  '923342402939',  '923342893756',  '923346728606',  '923351289226',
  '923353886056',  '923358763443',  '923358775056',  '923360896121',  '923363758243',
  '923366041711',  '923368020655',  '923374403473',  '923401249758',  '923402561945',
  '923404770019',  '923411366603',  '923418163945',  '923422042524',  '923432911164',
  '923468319667'
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;
  try {
    // Get a client from the pool
    client = await pool.connect();

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

    const result = await client.query(query, COHORT_PHONES);

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

    // Conversion funnel
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

    res.status(200).json({
      timestamp: new Date().toISOString(),
      breakdown,
      funnel,
      aggregateFeatures,
      userStats: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch engagement stats',
      message: error.message
    });
  } finally {
    // Always release the client back to the pool
    if (client) {
      client.release();
    }
  }
}
