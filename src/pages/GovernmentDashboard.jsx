import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, helpRequestAPI, volunteerAPI, alertAPI } from '../services/api';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Activity,
  MapPin,
  Clock,
  Plus,
  Send,
  Eye,
  CheckCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import './Dashboard.css';

const GovernmentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [helpRequests, setHelpRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    type: 'warning',
    location: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, helpRes, volunteersRes, alertsRes] = await Promise.all([
        dashboardAPI.getStats(),
        helpRequestAPI.getAll(),
        volunteerAPI.getAll(),
        alertAPI.getAll()
      ]);

      setStats(statsRes.data);
      setHelpRequests(helpRes.data);
      setVolunteers(volunteersRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await alertAPI.create({
        ...newAlert,
        createdBy: user.id
      });
      setNewAlert({ title: '', message: '', type: 'warning', location: '' });
      setShowCreateAlert(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'assigned': return '#f59e0b';
      case 'pending': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading government dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Government Command Center</h1>
          <p className="user-role">Emergency Management Dashboard</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateAlert(true)}
          >
            <Plus className="btn-icon" />
            Create Alert
          </button>
        </div>
      </div>

      {/* Critical Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon requests">
            <AlertTriangle />
          </div>
          <div className="stat-content">
            <h3>{helpRequests.filter(r => r.urgency === 'critical').length}</h3>
            <p>Critical Incidents</p>
            <span className="stat-trend negative">Requires immediate attention</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon volunteers">
            <Users />
          </div>
          <div className="stat-content">
            <h3>{volunteers.length}</h3>
            <p>Active Volunteers</p>
            <span className="stat-trend positive">Ready for deployment</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <Activity />
          </div>
          <div className="stat-content">
            <h3>{helpRequests.filter(r => r.status === 'in-progress').length}</h3>
            <p>Active Operations</p>
            <span className="stat-trend neutral">In progress</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon alerts">
            <Shield />
          </div>
          <div className="stat-content">
            <h3>{alerts.length}</h3>
            <p>Active Alerts</p>
            <span className="stat-trend positive">Public notifications</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Critical Incidents */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Critical Incident Management</h2>
            <button className="btn btn-outline">
              <BarChart3 className="btn-icon" />
              View Analytics
            </button>
          </div>
          <div className="requests-list">
            {helpRequests
              .filter(request => request.urgency === 'critical' || request.urgency === 'high')
              .slice(0, 5)
              .map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <h4>{request.title}</h4>
                  <div className="request-meta">
                    <span 
                      className="urgency-badge"
                      style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                    >
                      {request.urgency}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ color: getStatusColor(request.status) }}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
                <p className="request-description">{request.description}</p>
                <div className="request-footer">
                  <div className="request-location">
                    <MapPin className="location-icon" />
                    <span>{request.location}</span>
                  </div>
                  <div className="request-time">
                    <Clock className="time-icon" />
                    <span>{new Date(request.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="request-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                    <Users className="btn-icon" />
                    Deploy Resources
                  </button>
                  <button className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                    <Eye className="btn-icon" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Management */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Resource Deployment</h2>
            <button className="btn btn-outline">Manage All</button>
          </div>
          <div className="volunteers-grid">
            {volunteers.slice(0, 6).map((volunteer) => (
              <div key={volunteer._id} className="volunteer-card">
                <div className="volunteer-avatar">
                  {volunteer.name.charAt(0).toUpperCase()}
                </div>
                <div className="volunteer-info">
                  <h4>{volunteer.name}</h4>
                  <p>{volunteer.location}</p>
                  <div className="volunteer-skills">
                    {volunteer.skills?.slice(0, 2).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="volunteer-status">
                  <CheckCircle className="status-icon active" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Response Analytics</h2>
            <button className="btn btn-outline">Full Report</button>
          </div>
          <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="metric-card" style={{ padding: '1.5rem', backgroundColor: 'var(--dark-bg)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <TrendingUp style={{ width: '1.25rem', height: '1.25rem', color: 'var(--success)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Average Response Time</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>14.2 min</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>↓ 12% from last week</div>
            </div>
            <div className="metric-card" style={{ padding: '1.5rem', backgroundColor: 'var(--dark-bg)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary-blue)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Resolution Rate</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>94.7%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>↑ 3% from last week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Alert Modal */}
      {showCreateAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--dark-secondary)',
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid var(--border-color)',
            width: '100%',
            maxWidth: '500px',
            margin: '1rem'
          }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Create Emergency Alert</h3>
            <form onSubmit={handleCreateAlert}>
              <div className="form-group">
                <label>Alert Type</label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                  className="form-input"
                  placeholder="Alert title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newAlert.location}
                  onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                  className="form-input"
                  placeholder="Affected area"
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                  className="form-textarea"
                  placeholder="Alert message"
                  rows={4}
                  required
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowCreateAlert(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send className="btn-icon" />
                  Send Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentDashboard;