import React, { useState, useEffect } from 'react';
import './BalochistanDashboard.css';

const BalochistanDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  // For Next.js, use relative API path instead of full URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
        setLastUpdate(new Date());
        setError(null);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchStats();

    // Set up 5-second interval
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, [API_URL]);

  if (loading) return <div className="dashboard loading">Loading dashboard...</div>;
  if (error) return <div className="dashboard error">Error: {error}</div>;
  if (!stats) return <div className="dashboard error">No data</div>;

  const { breakdown, funnel, aggregateFeatures, userStats } = stats;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎓 Balochistan Winter School - Live Engagement Dashboard</h1>
        <p className="subtitle">March 17 Cohort (37 teachers) | Last updated: {lastUpdate?.toLocaleTimeString()}</p>
      </header>

      {/* Key Metrics Cards */}
      <section className="metrics-grid">
        <MetricCard
          title="Cohort Size"
          value={breakdown.total}
          color="#3498db"
          unit="teachers"
        />
        <MetricCard
          title="Highly Active"
          value={breakdown.highlyActive}
          percentage={(breakdown.highlyActive / breakdown.total) * 100}
          color="#27ae60"
        />
        <MetricCard
          title="Recently Active"
          value={breakdown.recentlyActive}
          percentage={(breakdown.recentlyActive / breakdown.total) * 100}
          color="#f39c12"
        />
        <MetricCard
          title="Dormant"
          value={breakdown.dormant}
          percentage={(breakdown.dormant / breakdown.total) * 100}
          color="#e74c3c"
        />
      </section>

      {/* Engagement Breakdown Chart */}
      <section className="section">
        <h2>Engagement Breakdown</h2>
        <div className="engagement-bars">
          <EngagementBar
            label="Highly Active"
            count={breakdown.highlyActive}
            total={breakdown.total}
            color="#27ae60"
          />
          <EngagementBar
            label="Recently Active"
            count={breakdown.recentlyActive}
            total={breakdown.total}
            color="#f39c12"
          />
          <EngagementBar
            label="Moderately Active"
            count={breakdown.moderatelyActive}
            total={breakdown.total}
            color="#3498db"
          />
          <EngagementBar
            label="Dormant"
            count={breakdown.dormant}
            total={breakdown.total}
            color="#e74c3c"
          />
        </div>
      </section>

      {/* Conversion Funnel */}
      <section className="section">
        <h2>Conversion Funnel</h2>
        <div className="funnel">
          <FunnelStep
            label="Onboarded"
            value={funnel.onboarded}
            total={funnel.onboarded}
            step={1}
          />
          <FunnelStep
            label="Sent 1+ Messages"
            value={funnel.messagedOnce}
            total={funnel.onboarded}
            step={2}
          />
          <FunnelStep
            label="Frequent Users (5+ msgs)"
            value={funnel.messageFrequent}
            total={funnel.onboarded}
            step={3}
          />
          <FunnelStep
            label="Feature Users"
            value={funnel.featureUsers}
            total={funnel.onboarded}
            step={4}
          />
        </div>
      </section>

      {/* Feature Usage */}
      <section className="section">
        <h2>Feature Usage (Aggregate)</h2>
        <div className="feature-grid">
          <FeatureCard icon="💬" label="Messages" value={aggregateFeatures.totalMessages} />
          <FeatureCard icon="📝" label="Lesson Plans" value={aggregateFeatures.totalLessonPlans} />
          <FeatureCard icon="🎤" label="Coaching" value={aggregateFeatures.totalCoaching} />
          <FeatureCard icon="📖" label="Reading" value={aggregateFeatures.totalReading} />
          <FeatureCard icon="🎥" label="Videos" value={aggregateFeatures.totalVideos} />
          <FeatureCard icon="🖼️" label="Image Analysis" value={aggregateFeatures.totalImages} />
        </div>
      </section>

      {/* Top Users */}
      <section className="section">
        <h2>Top 10 Most Active Users</h2>
        <div className="user-list">
          {userStats.slice(0, 10).map((user, idx) => (
            <UserRow key={user.phone} user={user} rank={idx + 1} />
          ))}
        </div>
      </section>

      {/* All Users Table */}
      <section className="section">
        <h2>All Users</h2>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Phone</th>
                <th>Messages</th>
                <th>LP</th>
                <th>Images</th>
                <th>Status</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map(user => (
                <tr key={user.phone} className={`status-${user.status.toLowerCase().replace(' ', '-')}`}>
                  <td>{user.phone}</td>
                  <td>{user.messages}</td>
                  <td>{user.lessonPlans}</td>
                  <td>{user.imageAnalyses}</td>
                  <td><span className="status-badge">{user.status}</span></td>
                  <td>{user.daysSinceLastActivity !== null ? `${user.daysSinceLastActivity} days ago` : 'Never'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>Auto-refreshing every 5 seconds | Balochistan Winter School Campaign</p>
      </footer>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, percentage, color, unit }) => (
  <div className="metric-card" style={{ borderTopColor: color }}>
    <h3>{title}</h3>
    <div className="metric-value">{value}</div>
    {percentage !== undefined && <div className="metric-percentage">{percentage.toFixed(1)}%</div>}
    {unit && <div className="metric-unit">{unit}</div>}
  </div>
);

// Engagement Bar Component
const EngagementBar = ({ label, count, total, color }) => {
  const percentage = (count / total) * 100;
  return (
    <div className="engagement-bar-wrapper">
      <div className="label">{label}</div>
      <div className="bar-container">
        <div className="bar" style={{ width: `${percentage}%`, backgroundColor: color }}>
          {percentage > 10 && <span className="bar-label">{count}</span>}
        </div>
      </div>
      <div className="count">{count} ({percentage.toFixed(1)}%)</div>
    </div>
  );
};

// Funnel Step Component
const FunnelStep = ({ label, value, total, step }) => {
  const percentage = (value / total) * 100;
  const width = percentage;
  return (
    <div className="funnel-step">
      <div className="funnel-bar" style={{ width: `${width}%` }}>
        <div className="funnel-label">{label}</div>
        <div className="funnel-count">{value} ({percentage.toFixed(1)}%)</div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, label, value }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <div className="feature-label">{label}</div>
    <div className="feature-value">{value}</div>
  </div>
);

// User Row Component
const UserRow = ({ user, rank }) => (
  <div className="user-row">
    <div className="rank">#{rank}</div>
    <div className="phone">{user.phone}</div>
    <div className="messages">{user.messages} msgs</div>
    <div className="status" style={{ color: getStatusColor(user.status) }}>
      {user.status}
    </div>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'HIGHLY ACTIVE':
      return '#27ae60';
    case 'RECENTLY ACTIVE':
      return '#f39c12';
    case 'MODERATELY ACTIVE':
      return '#3498db';
    default:
      return '#e74c3c';
  }
};

export default BalochistanDashboard;
