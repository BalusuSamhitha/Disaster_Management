import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, AlertTriangle, Heart } from 'lucide-react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="hero-overlay"></div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title fade-in-up">
              Connecting Relief. <span className="text-gold">Saving Lives.</span>
            </h1>
            <p className="hero-subtitle fade-in-up">
              A comprehensive disaster management platform that connects government officials, 
              volunteers, and those in need during natural disasters and emergencies.
            </p>
            
            <div className="hero-buttons fade-in-up">
              <Link to="/request-help" className="btn btn-primary">
                <AlertTriangle className="btn-icon" />
                Request Help
                <ArrowRight className="btn-icon-right" />
              </Link>
              <Link to="/volunteer" className="btn btn-secondary">
                <Heart className="btn-icon" />
                Join as Volunteer
              </Link>
              <Link to="/login" className="btn btn-outline">
                <Users className="btn-icon" />
                Login
              </Link>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Lives Saved</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Volunteers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Emergency Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;