import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <Link to="/" className="footer-logo">
              <Shield className="logo-icon" />
              <span>ReliefConnect</span>
            </Link>
            <p className="footer-description">
              Connecting relief efforts worldwide to save lives during disasters and emergencies. 
              Building stronger communities through coordinated response and volunteer networks.
            </p>
            
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/features" className="footer-link">Features</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
              <Link to="/volunteer" className="footer-link">Become a Volunteer</Link>
              <Link to="/request-help" className="footer-link">Request Help</Link>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Services</h3>
            <div className="footer-links">
              <Link to="/government" className="footer-link">Government Dashboard</Link>
              <Link to="/volunteer-portal" className="footer-link">Volunteer Portal</Link>
              <Link to="/emergency-alerts" className="footer-link">Emergency Alerts</Link>
              <Link to="/analytics" className="footer-link">Analytics & Reports</Link>
              <Link to="/training" className="footer-link">Training Resources</Link>
              <Link to="/api-docs" className="footer-link">API Documentation</Link>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact Info</h3>
            <div className="contact-info">
              <div className="contact-item">
                <Mail className="contact-icon" />
                <div>
                  <span>support@reliefconnect.org</span>
                  <small>General Support</small>
                </div>
              </div>
              <div className="contact-item">
                <Phone className="contact-icon" />
                <div>
                  <span>**************</span>
                  <small>24/7 Emergency Line</small>
                </div>
              </div>
              <div className="contact-item">
                <MapPin className="contact-icon" />
                
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <div className="legal-links">
              <Link to="/privacy" className="legal-link">Privacy Policy</Link>
              <Link to="/terms" className="legal-link">Terms & Conditions</Link>
              <Link to="/cookies" className="legal-link">Cookie Policy</Link>
              <Link to="/accessibility" className="legal-link">Accessibility</Link>
            </div>
            <div className="copyright">
              <p>&copy; {currentYear} ReliefConnect. All rights reserved.</p>
              <p className="disclaimer">
                ReliefConnect is a disaster management platform. In case of life-threatening emergencies, 
                contact your local emergency services immediately.
              </p>
            </div>
          </div>

          <div className="footer-certifications">
            
            <div className="cert-item">
              <div className="cert-badge">SOC 2</div>
              <small>Compliance</small>
            </div>
            <div className="cert-item">
              <div className="cert-badge">GDPR</div>
              <small>Privacy Compliant</small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;