import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitForm = async () => {
      try {
        await contactAPI.submit(formData);
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
      } catch (error) {
        console.error('Error submitting contact form:', error);
        // Handle error appropriately
      }
    };
    
    submitForm();
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">
          Have questions about ReliefConnect? Need support during an emergency? 
          We're here to help 24/7.
        </p>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <h3 className="info-title">Contact Information</h3>
              
              <div className="info-item">
                <div className="info-icon">
                  <Mail />
                </div>
                <div className="info-details">
                  <h4>Email Support</h4>
                  <p>support@reliefconnect.org</p>
                  <span>Response within 2 hours</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Phone />
                </div>
                <div className="info-details">
                  <h4>Emergency Hotline</h4>
                  <p>+1 (555) 123-HELP</p>
                  <span>24/7 Emergency Support</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <MapPin />
                </div>
                <div className="info-details">
                  <h4>Headquarters</h4>
                  <p>123 Relief Street<br />Emergency City, EC 12345</p>
                  <span>Global Operations Center</span>
                </div>
              </div>
            </div>

            <div className="emergency-notice">
              <div className="notice-header">
                <div className="emergency-icon">⚠️</div>
                <h4>Emergency Notice</h4>
              </div>
              <p>
                If you're experiencing a life-threatening emergency, 
                please contact your local emergency services immediately.
              </p>
              <div className="emergency-numbers">
                <span>🇺🇸 911</span>
                <span>🇬🇧 999</span>
                <span>🇪🇺 112</span>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3 className="form-title">Send Us a Message</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-input form-select"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="volunteer">Volunteer Registration</option>
                  <option value="government">Government Partnership</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="emergency">Emergency Support</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  required
                  placeholder="Please describe your inquiry or how we can help you..."
                  rows={5}
                ></textarea>
              </div>

              <button
                type="submit"
                className={`btn btn-primary form-submit ${isSubmitted ? 'submitted' : ''}`}
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <>
                    <Check className="btn-icon" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="btn-icon" />
                    Send Message
                  </>
                )}
              </button>

              {isSubmitted && (
                <div className="success-message">
                  <p>Thank you for your message! We'll get back to you within 24 hours.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;