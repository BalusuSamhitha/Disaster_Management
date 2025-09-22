import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, helpRequestAPI, alertAPI } from '../services/api';
import { 
  AlertTriangle, 
  MapPin, 
  Bell, 
  FileText,
  Plus,
  Clock,
  Shield,
  Phone,
  Navigation,
  Eye
} from 'lucide-react';
import './Dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myRequests, setMyRequests] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyHelp, setNearbyHelp] = useState([
    { name: 'City Emergency Shelter', distance: '0.8 km', type: 'Shelter', status: 'Open' },
    { name: 'Red Cross Aid Station', distance: '1.2 km', type: 'Medical', status: 'Open' },
    { name: 'Community Food Bank', distance: '2.1 km', type: 'Food', status: 'Open' }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [helpRes, alertsRes] = await Promise.all([
        helpRequestAPI.getAll(),
        alertAPI.getAll()
      ]);

      // Filter requests for current user
      const userRequests = helpRes.data.filter(req => 
        req.userId === user.id || 
        req.userId?._id === user.id ||
        (typeof req.userId === 'object' && req.userId._id === user.id)
      );
      setMyRequests(userRequests);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.name}</h1>
          <p className="user-role">Emergency Assistance Dashboard</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/request-help')}
          >
            <Plus className="btn-icon" />
            Request Help
          </button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div 
          className="action-card"
          style={{ 
            padding: '2rem', 
            backgroundColor: 'var(--dark-secondary)', 
            borderRadius: '1rem', 
            border: '1px solid var(--border-color)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => navigate('/request-help')}
        >
          <AlertTriangle style={{ width: '3rem', height: '3rem', color: 'var(--error)', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Emergency Help</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Request immediate assistance</p>
        </div>

        <div 
          className="action-card"
          style={{ 
            padding: '2rem', 
            backgroundColor: 'var(--dark-secondary)', 
            borderRadius: '1rem', 
            border: '1px solid var(--border-color)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <MapPin style={{ width: '3rem', height: '3rem', color: 'var(--primary-blue)', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Find Shelter</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Locate nearby safe areas</p>
        </div>

        <div 
          className="action-card"
          style={{ 
            padding: '2rem', 
            backgroundColor: 'var(--dark-secondary)', 
            borderRadius: '1rem', 
            border: '1px solid var(--border-color)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <Bell style={{ width: '3rem', height: '3rem', color: 'var(--warning)', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Emergency Alerts</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>View safety notifications</p>
        </div>

        <div 
          className="action-card"
          style={{ 
            padding: '2rem', 
            backgroundColor: 'var(--dark-secondary)', 
            borderRadius: '1rem', 
            border: '1px solid var(--border-color)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <FileText style={{ width: '3rem', height: '3rem', color: 'var(--success)', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>My Requests</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track help requests</p>
        </div>
      </div>

      <div className="dashboard-content">
        {/* My Help Requests */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Help Requests</h2>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/request-help')}
            >
              <Plus className="btn-icon" />
              New Request
            </button>
          </div>
          {myRequests.length > 0 ? (
            <div className="requests-list">
              {myRequests.map((request) => (
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
                      <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {request.status === 'assigned' && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--dark-bg)', borderRadius: '0.5rem' }}>
                      <p style={{ color: 'var(--success)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        ✓ Volunteer assigned - Help is on the way!
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <AlertTriangle style={{ width: '3rem', height: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
              <p>No help requests yet. Click "Request Help" if you need assistance.</p>
            </div>
          )}
        </div>

        {/* Nearby Help */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Nearby Emergency Services</h2>
            <button className="btn btn-outline">
              <Navigation className="btn-icon" />
              View Map
            </button>
          </div>
          <div className="nearby-help-list">
            {nearbyHelp.map((place, index) => (
              <div key={index} className="help-location-card" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                backgroundColor: 'var(--dark-bg)',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-color)',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: 'var(--primary-blue)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {place.type === 'Shelter' && <Shield />}
                  {place.type === 'Medical' && <Plus />}
                  {place.type === 'Food' && <MapPin />}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{place.name}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {place.type} • {place.distance} away
                  </p>
                  <span style={{ 
                    color: place.status === 'Open' ? 'var(--success)' : 'var(--error)',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {place.status}
                  </span>
                </div>
                <button className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                  <Phone className="btn-icon" />
                  Contact
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Alerts */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Emergency Alerts</h2>
            <button className="btn btn-outline">View All</button>
          </div>
          <div className="alerts-list">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert._id} className={`alert-card alert-${alert.type}`}>
                <div className="alert-header">
                  <h4>{alert.title}</h4>
                  <span className="alert-time">
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                {alert.location && (
                  <div className="alert-location">
                    <MapPin className="location-icon" />
                    <span>{alert.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Emergency Contacts</h2>
          </div>
          <div className="emergency-contacts" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--dark-bg)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Phone style={{ width: '1.25rem', height: '1.25rem', color: 'var(--error)' }} />
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Emergency Services</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>911 (US) • 999 (UK) • 112 (EU)</p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--dark-bg)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Phone style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary-blue)' }} />
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>ReliefConnect Hotline</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>+1 (555) 123-HELP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;