import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, helpRequestAPI, volunteerAPI, helpRequestStatusAPI } from '../services/api';
import { 
  Heart, 
  MapPin, 
  Clock, 
  CheckCircle,
  Star,
  Award,
  Users,
  Activity,
  Plus,
  Eye,
  User
} from 'lucide-react';
import './Dashboard.css';

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [stats, setStats] = useState({
    tasksCompleted: 12,
    peopleHelped: 28,
    hoursVolunteered: 45,
    rating: 4.8
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [helpRes] = await Promise.all([
        helpRequestAPI.getAll()
      ]);

      // Filter available tasks (not assigned or assigned to current user)
      const available = helpRes.data.filter(req => 
        req.status === 'pending' || 
        (req.assignedVolunteer === user.id)
      );
      
      const assigned = helpRes.data.filter(req => 
        req.assignedVolunteer === user.id
      );

      setAvailableTasks(available.filter(req => req.status === 'pending'));
      setMyTasks(assigned);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId) => {
    try {
      console.log('Accepting task:', taskId);
      await volunteerAPI.assignToRequest(taskId, user.id);
      fetchDashboardData();
    } catch (error) {
      console.error('Error accepting task:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      console.log('Completing task:', taskId);
      await helpRequestStatusAPI.updateStatus(taskId, 'completed');
      fetchDashboardData();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      console.log('Updating task status:', taskId, 'to', status);
      await helpRequestStatusAPI.updateStatus(taskId, status);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating task status:', error);
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
          <p>Loading volunteer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Volunteer Dashboard</h1>
          <p className="user-role">Thank you for helping your community, {user?.name}!</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/volunteer')}
          >
            <User className="btn-icon" />
            Update Profile
          </button>
        </div>
      </div>

      {/* Volunteer Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon volunteers">
            <CheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.tasksCompleted}</h3>
            <p>Tasks Completed</p>
            <span className="stat-trend positive">+3 this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <Users />
          </div>
          <div className="stat-content">
            <h3>{stats.peopleHelped}</h3>
            <p>People Helped</p>
            <span className="stat-trend positive">+7 this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon requests">
            <Clock />
          </div>
          <div className="stat-content">
            <h3>{stats.hoursVolunteered}</h3>
            <p>Hours Volunteered</p>
            <span className="stat-trend positive">+12 this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon alerts">
            <Star />
          </div>
          <div className="stat-content">
            <h3>{stats.rating}</h3>
            <p>Average Rating</p>
            <span className="stat-trend positive">Excellent service</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Available Tasks */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Available Help Requests</h2>
            <button className="btn btn-outline">
              <MapPin className="btn-icon" />
              View Map
            </button>
          </div>
          {availableTasks.length > 0 ? (
            <div className="requests-list">
              {availableTasks.slice(0, 5).map((task) => (
                <div key={task._id} className="request-card">
                  <div className="request-header">
                    <h4>{task.title}</h4>
                    <div className="request-meta">
                      <span 
                        className="urgency-badge"
                        style={{ backgroundColor: getUrgencyColor(task.urgency) }}
                      >
                        {task.urgency}
                      </span>
                      <span className="category-badge" style={{ 
                        backgroundColor: 'var(--primary-blue)', 
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {task.category}
                      </span>
                    </div>
                  </div>
                  <p className="request-description">{task.description}</p>
                  <div className="request-footer">
                    <div className="request-location">
                      <MapPin className="location-icon" />
                      <span>{task.location}</span>
                    </div>
                    <div className="request-time">
                      <Clock className="time-icon" />
                      <span>{new Date(task.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="task-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-primary"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                      onClick={() => handleAcceptTask(task._id)}
                    >
                      <Heart className="btn-icon" />
                      Accept Task
                    </button>
                    <button 
                      className="btn btn-outline"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      <Eye className="btn-icon" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <Heart style={{ width: '3rem', height: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
              <p>No available tasks at the moment. Check back soon!</p>
            </div>
          )}
        </div>

        {/* My Active Tasks */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Active Tasks</h2>
            <button className="btn btn-outline">View History</button>
          </div>
          {myTasks.length > 0 ? (
            <div className="requests-list">
              {myTasks.map((task) => (
                <div key={task._id} className="request-card">
                  <div className="request-header">
                    <h4>{task.title}</h4>
                    <div className="request-meta">
                      <span 
                        className="status-badge"
                        style={{ color: getStatusColor(task.status) }}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <p className="request-description">{task.description}</p>
                  <div className="request-footer">
                    <div className="request-location">
                      <MapPin className="location-icon" />
                      <span>{task.location}</span>
                    </div>
                    <div className="request-time">
                      <Clock className="time-icon" />
                      <span>Accepted {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="task-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-primary"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                      onClick={() => handleCompleteTask(task._id)}
                    >
                      <CheckCircle className="btn-icon" />
                      Mark Complete
                    </button>
                    <button 
                      className="btn btn-outline"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                      onClick={() => handleUpdateStatus(task._id, 'in-progress')}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <Activity style={{ width: '3rem', height: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
              <p>No active tasks. Accept a task from the available requests above.</p>
            </div>
          )}
        </div>

        {/* Skills & Availability */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Profile</h2>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/volunteer')}
            >
              Edit Profile
            </button>
          </div>
          <div className="profile-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Skills & Expertise</h4>
              <div className="skills-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {user?.skills?.map((skill, index) => (
                  <span key={index} className="skill-tag" style={{
                    backgroundColor: 'var(--primary-blue)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {skill}
                  </span>
                )) || (
                  <p style={{ color: 'var(--text-secondary)' }}>No skills listed. Update your profile to add skills.</p>
                )}
              </div>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Contact Information</h4>
              <div style={{ color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '0.5rem' }}>📧 {user?.email}</p>
                <p style={{ marginBottom: '0.5rem' }}>📞 {user?.phone || 'Not provided'}</p>
                <p>📍 {user?.location || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Achievements</h2>
          </div>
          <div className="achievements-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="achievement-card" style={{
              padding: '1.5rem',
              backgroundColor: 'var(--dark-bg)',
              borderRadius: '0.75rem',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <Award style={{ width: '2.5rem', height: '2.5rem', color: 'var(--primary-gold)', marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Helper Hero</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Completed 10+ tasks</p>
            </div>
            <div className="achievement-card" style={{
              padding: '1.5rem',
              backgroundColor: 'var(--dark-bg)',
              borderRadius: '0.75rem',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <Star style={{ width: '2.5rem', height: '2.5rem', color: 'var(--primary-gold)', marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>5-Star Volunteer</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Excellent ratings</p>
            </div>
            <div className="achievement-card" style={{
              padding: '1.5rem',
              backgroundColor: 'var(--dark-bg)',
              borderRadius: '0.75rem',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <Heart style={{ width: '2.5rem', height: '2.5rem', color: 'var(--error)', marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Community Champion</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>25+ people helped</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;