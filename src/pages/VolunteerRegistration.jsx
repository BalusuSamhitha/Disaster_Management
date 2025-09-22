import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, Mail, Phone, MapPin, Award, Clock, CheckCircle } from 'lucide-react';
import './VolunteerRegistration.css';

const VolunteerRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    skills: [],
    availability: [],
    experience: '',
    motivation: '',
    emergencyContact: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const skillOptions = [
    'First Aid/CPR',
    'Medical Training',
    'Search & Rescue',
    'Emergency Response',
    'Communication',
    'Transportation',
    'Food Service',
    'Shelter Management',
    'Logistics',
    'Translation',
    'Counseling',
    'Construction',
    'Technology Support',
    'Animal Rescue',
    'Other'
  ];

  const availabilityOptions = [
    'Weekdays',
    'Weekends',
    'Evenings',
    'Emergency On-Call',
    '24/7 Available',
    'Flexible Schedule'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'skills' || name === 'availability') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const volunteerData = {
        ...formData,
        role: 'volunteer'
      };

      const result = await register(volunteerData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user?.role === 'volunteer') {
    return (
      <div className="volunteer-container">
        <div className="already-registered">
          <Heart className="success-icon" />
          <h1>Welcome Back, Volunteer!</h1>
          <p>You're already registered as a volunteer. Thank you for your service!</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="volunteer-container">
      <div className="volunteer-header">
        <Heart className="volunteer-logo" />
        <h1>Join Our Volunteer Network</h1>
        <p>Help save lives and support communities during disasters</p>
        
        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3].map((stepNum) => (
              <div 
                key={stepNum}
                className={`progress-step ${step >= stepNum ? 'active' : ''}`}
              >
                <div className="step-number">{stepNum}</div>
                <div className="step-label">
                  {stepNum === 1 && 'Personal Info'}
                  {stepNum === 2 && 'Skills & Availability'}
                  {stepNum === 3 && 'Final Details'}
                </div>
              </div>
            ))}
          </div>
          <div 
            className="progress-fill"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="volunteer-content">
        <form className="volunteer-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="form-step">
              <h2>Personal Information</h2>
              <p>Tell us about yourself so we can match you with the right opportunities.</p>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <div className="input-wrapper">
                    <Phone className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />
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
                    placeholder="City, State/Province, Country"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Skills & Availability */}
          {step === 2 && (
            <div className="form-step">
              <h2>Skills & Availability</h2>
              <p>Help us understand your capabilities and when you're available to help.</p>

              <div className="form-group">
                <label>Skills & Expertise</label>
                <p className="field-description">Select all skills that apply to you:</p>
                <div className="checkbox-grid">
                  {skillOptions.map((skill) => (
                    <label key={skill} className="checkbox-item">
                      <input
                        type="checkbox"
                        name="skills"
                        value={skill}
                        checked={formData.skills.includes(skill)}
                        onChange={handleChange}
                      />
                      <span className="checkbox-label">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Availability</label>
                <p className="field-description">When are you typically available to volunteer?</p>
                <div className="checkbox-grid">
                  {availabilityOptions.map((option) => (
                    <label key={option} className="checkbox-item">
                      <input
                        type="checkbox"
                        name="availability"
                        value={option}
                        checked={formData.availability.includes(option)}
                        onChange={handleChange}
                      />
                      <span className="checkbox-label">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="experience">Previous Experience</label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Describe any relevant volunteer or professional experience..."
                  className="form-textarea"
                  rows={4}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Final Details */}
          {step === 3 && (
            <div className="form-step">
              <h2>Final Details</h2>
              <p>Just a few more details to complete your registration.</p>

              <div className="form-group">
                <label htmlFor="motivation">Why do you want to volunteer?</label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  placeholder="Tell us what motivates you to help others during disasters..."
                  className="form-textarea"
                  rows={4}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="emergencyContact">Emergency Contact</label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Name and phone number of emergency contact"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-item terms-checkbox">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                  <span className="checkbox-label">
                    I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and 
                    <a href="/privacy" target="_blank"> Privacy Policy</a>
                  </span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading || !formData.agreeToTerms}>
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Registering...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="btn-icon" />
                      Complete Registration
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="volunteer-info">
          <div className="info-card">
            <Award className="info-icon" />
            <h3>Make a Difference</h3>
            <p>Join thousands of volunteers helping communities recover from disasters worldwide.</p>
          </div>

          <div className="info-card">
            <Clock className="info-icon" />
            <h3>Flexible Commitment</h3>
            <p>Volunteer on your schedule. Every hour of help makes a meaningful impact.</p>
          </div>

          <div className="info-card">
            <Heart className="info-icon" />
            <h3>Save Lives</h3>
            <p>Your skills and compassion can be the difference between life and death for someone in need.</p>
          </div>

          <div className="volunteer-stats">
            <h3>Our Impact</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">5,000+</div>
                <div className="stat-label">Active Volunteers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">25,000+</div>
                <div className="stat-label">Lives Saved</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">150+</div>
                <div className="stat-label">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistration;