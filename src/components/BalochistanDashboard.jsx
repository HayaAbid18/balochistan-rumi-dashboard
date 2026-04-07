import { useState, useEffect } from 'react';
import './BalochistanDashboard.css';

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
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return <div className="dashboard-container"><p>Loading...</p></div>;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return <div className="dashboard-container"><p>No data available</p></div>;
  }

  const { breakdown, funnel, aggregateFeatures } = stats;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Balochistan Winter School Cohort</h1>
        <p>Rumi Platform Engagement Dashboard</p>
        <p className="last-update">Last updated: {lastUpdate?.toLocaleTimeString()}</p>
      </header>

      <div className="dashboard-grid">
        <section className="metrics-section">
          <h2>Engagement Breakdown</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-number">{breakdown.highlyActive}</div>
              <div className="metric-label">Highly Active</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">{breakdown.recentlyActive}</div>
              <div className="metric-label">Recently Active</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">{breakdown.moderatelyActive}</div>
              <div className="metric-label">Moderately Active</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">{breakdown.dormant}</div>
              <div className="metric-label">Dormant</div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Feature Usage</h2>
          <div className="features-grid">
            <div className="feature-card">💬 Messages: {aggregateFeatures.totalMessages}</div>
            <div className="feature-card">📄 Lesson Plans: {aggregateFeatures.totalLessonPlans}</div>
            <div className="feature-card">🎯 Coaching: {aggregateFeatures.totalCoaching}</div>
            <div className="feature-card">📖 Reading: {aggregateFeatures.totalReading}</div>
            <div className="feature-card">🎬 Videos: {aggregateFeatures.totalVideos}</div>
            <div className="feature-card">🖼️ Images: {aggregateFeatures.totalImages}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
