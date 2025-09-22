import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { helpRequestAPI } from '../services/api';
import { AlertTriangle, MapPin, Phone, Clock, Send } from 'lucide-react';
import './RequestHelp.css';

const RequestHelp = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    urgency: 'medium',
    category: '',
    contactPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Medical Emergency',
    'Food & Water',
    'Shelter',
    'Transportation',
    'Search & Rescue',
    'Evacuation',
    'Communication',
    'Other'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: '#10b981', description: 'Non-urgent assistance needed' },
    { value: 'medium', label: 'Medium', color: '#3b82f6', description: 'Assistance needed within hours' },
    { value: 'high', label: 'High', color: '#f59e0b', description: 'Urgent assistance needed' },
    { value: 'critical', label: 'Critical', color: '#ef4444', description: 'Life-threatening emergency' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestData = {
        ...formData,
        userId: user.id
      };
      await helpRequestAPI.create(requestData);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        location: '',
        urgency: 'medium',
        category: '',
        contactPhone: ''
      });
    } catch (error) {
      console.error('Help request submission error:', error);
      setError(error.response?.data?.message || 'Failed to submit help request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="request-help-container">
        <div className="success-card">
          <div className="success-icon">
            <AlertTriangle />
          </div>
          <h1>Help Request Submitted!</h1>
          <p>
            Your request has been successfully submitted and is now visible to volunteers 
            and emergency responders in your area. You should receive assistance soon.
          </p>
          <div className="success-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => setSuccess(false)}
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="request-help-container">
      <div className="request-help-header">
        <div className="emergency-notice">
          <AlertTriangle className="emergency-icon" />
          <div>
            <h3>Emergency Notice</h3>
            <p>If this is a life-threatening emergency, call your local emergency services immediately!</p>
            <div className="emergency-numbers">
              <span>🇺🇸 911</span>
              <span>🇬🇧 999</span>
              <span>🇪🇺 112</span>
            </div>
          </div>
        </div>
      </div>

      <div className="request-help-content">
        <div className="form-section">
          <h1>Request Emergency Assistance</h1>
          <p>Fill out this form to request help from volunteers and emergency responders in your area.</p>

          <form className="help-request-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="title">Request Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of what you need"
                required
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="urgency">Urgency Level *</label>
                <div className="urgency-options">
                  {urgencyLevels.map((level) => (
                    <label key={level.value} className="urgency-option">
                      <input
                        type="radio"
                        name="urgency"
                        value={level.value}
                        checked={formData.urgency === level.value}
                        onChange={handleChange}
                      />
                      <div 
                        className="urgency-indicator"
                        style={{ backgroundColor: level.color }}
                      ></div>
                      <div className="urgency-info">
                        <span className="urgency-label">{level.label}</span>
                        <span className="urgency-description">{level.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Your current location or address"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Contact Phone</label>
              <div className="input-wrapper">
                <Phone className="input-icon" />
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Phone number for emergency contact"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about your situation, what help you need, and any other relevant details..."
                required
                className="form-textarea"
                rows={5}
              ></textarea>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send className="btn-icon" />
                  Submit Help Request
                </>
              )}
            </button>
          </form>
        </div>

        <div className="info-section">
          <div className="info-card">
            <Clock className="info-icon" />
            <h3>Response Time</h3>
            <p>
              Emergency requests are typically responded to within 15-30 minutes. 
              Non-urgent requests may take 1-2 hours.
            </p>
          </div>

          <div className="info-card">
            <MapPin className="info-icon" />
            <h3>Location Services</h3>
            <p>
              Providing accurate location information helps volunteers and responders 
              find you quickly. Be as specific as possible.
            </p>
          </div>

          <div className="info-card">
            <Phone className="info-icon" />
            <h3>Stay Connected</h3>
            <p>
              Keep your phone charged and accessible. Responders may need to contact 
              you for additional information or updates.
            </p>
          </div>

          <div className="safety-tips">
            <h3>Safety Tips</h3>
            <ul>
              <li>Stay calm and provide accurate information</li>
              <li>If possible, move to a safe location</li>
              <li>Keep important documents and supplies ready</li>
              <li>Follow instructions from emergency responders</li>
              <li>Update your status if your situation changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHelp;