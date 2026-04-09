import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BalochistanDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard error">
        <div className="error-container">
          <h2>⚠️ Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchStats}>Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard">
        <p>No data available</p>
      </div>
    );
  }

  const { breakdown, funnel, aggregateFeatures, userStats } = stats;

  // Chart data
  const engagementChartData = {
    labels: ['Highly Active', 'Recently Active', 'Moderately Active', 'Dormant'],
    datasets: [{
      data: [breakdown.highlyActive, breakdown.recentlyActive, breakdown.moderatelyActive, breakdown.dormant],
      backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
      borderColor: ['#059669', '#d97706', '#1e40af', '#dc2626'],
      borderWidth: 2
    }]
  };

  const featureChartData = {
    labels: ['Messages', 'Lesson Plans', 'Coaching', 'Reading Assessments', 'Videos', 'Images'],
    datasets: [{
      label: 'Total Usage',
      data: [
        aggregateFeatures.totalMessages,
        aggregateFeatures.totalLessonPlans,
        aggregateFeatures.totalCoaching,
        aggregateFeatures.totalReading,
        aggregateFeatures.totalVideos,
        aggregateFeatures.totalImages
      ],
      backgroundColor: '#667eea',
      borderColor: '#764ba2',
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#333',
          font: { size: 12, weight: 'bold' }
        }
      }
    }
  };

  // Top users
  const topUsers = userStats.slice(0, 10);

  // Conversion funnel percentages
  const funnelData = [
    { stage: 'Onboarded', count: funnel.onboarded, pct: 100 },
    { stage: 'Sent Messages', count: funnel.messagedOnce, pct: Math.round((funnel.messagedOnce / funnel.onboarded) * 100) },
    { stage: 'Frequent Users', count: funnel.messageFrequent, pct: Math.round((funnel.messageFrequent / funnel.onboarded) * 100) },
    { stage: 'Feature Users', count: funnel.featureUsers, pct: Math.round((funnel.featureUsers / funnel.onboarded) * 100) }
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Balochistan Teachers Cohort</h1>
        <p className="subtitle">Rumi Platform Engagement Analytics</p>
        <div className="header-meta">
          <span className="metric-badge">Total Users: {breakdown.total}</span>
          <span className="last-update">Last updated: {lastUpdate?.toLocaleTimeString()}</span>
        </div>
      </header>

      {/* Key Metrics */}
      <section className="metrics-section">
        <div className="metrics-grid">
          <div className="metric-card" style={{ borderTopColor: '#10b981' }}>
            <h3>Highly Active</h3>
            <div className="metric-value">{breakdown.highlyActive}</div>
            <div className="metric-unit">active in last 7 days, 5+ messages</div>
          </div>
          <div className="metric-card" style={{ borderTopColor: '#f59e0b' }}>
            <h3>Recently Active</h3>
            <div className="metric-value">{breakdown.recentlyActive}</div>
            <div className="metric-unit">active in last 7 days, &lt;5 messages</div>
          </div>
          <div className="metric-card" style={{ borderTopColor: '#3b82f6' }}>
            <h3>Moderately Active</h3>
            <div className="metric-value">{breakdown.moderatelyActive}</div>
            <div className="metric-unit">active 7-14 days ago</div>
          </div>
          <div className="metric-card" style={{ borderTopColor: '#ef4444' }}>
            <h3>Dormant</h3>
            <div className="metric-value">{breakdown.dormant}</div>
            <div className="metric-unit">inactive for 14+ days</div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="chart-container">
          <div className="chart-box">
            <h2>Engagement Distribution</h2>
            <Pie data={engagementChartData} options={chartOptions} />
          </div>
          <div className="chart-box">
            <h2>Feature Usage</h2>
            <Bar data={featureChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
          </div>
        </div>
      </section>

      {/* Conversion Funnel */}
      <section className="section">
        <h2>Conversion Funnel</h2>
        <div className="funnel">
          {funnelData.map((step, idx) => (
            <div key={idx} className="funnel-step">
              <div className="funnel-bar" style={{ width: `${step.pct}%` }}>
                <span className="funnel-label">{step.stage}</span>
                <span className="funnel-count">{step.count} ({step.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Summary */}
      <section className="section">
        <h2>Feature Usage Summary</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <div className="feature-label">Messages</div>
            <div className="feature-value">{aggregateFeatures.totalMessages}</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <div className="feature-label">Lesson Plans</div>
            <div className="feature-value">{aggregateFeatures.totalLessonPlans}</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <div className="feature-label">Coaching</div>
            <div className="feature-value">{aggregateFeatures.totalCoaching}</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <div className="feature-label">Reading Assessments</div>
            <div className="feature-value">{aggregateFeatures.totalReading}</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎬</div>
            <div className="feature-label">Videos</div>
            <div className="feature-value">{aggregateFeatures.totalVideos}</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🖼️</div>
            <div className="feature-label">Image Analysis</div>
            <div className="feature-value">{aggregateFeatures.totalImages}</div>
          </div>
        </div>
      </section>

      {/* Top Users Leaderboard */}
      <section className="section">
        <h2>Top Users by Engagement</h2>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Messages</th>
                <th>Features Used</th>
                <th>Last Active</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, idx) => {
                const featuresUsed = user.lessonPlans + user.coachingSessions + user.readingAssessments + user.videoRequests + user.imageAnalyses;
                return (
                  <tr key={idx} className={`status-${user.status.toLowerCase().replace(' ', '-')}`}>
                    <td className="rank">#{idx + 1}</td>
                    <td className="name">{user.name || 'Unknown'}</td>
                    <td className="phone">{user.phone}</td>
                    <td className="messages"><strong>{user.messages}</strong></td>
                    <td className="features">{featuresUsed} features</td>
                    <td className="last-active">
                      {user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : 'Never'}
                      <br />
                      <small>({user.daysSinceLastActivity || 'N/A'} days ago)</small>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status.toLowerCase().replace(' ', '-')}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>Balochistan Teachers Cohort • Rumi Platform Analytics • Last synced: {lastUpdate?.toLocaleString()}</p>
      </footer>
    </div>
  );
}
