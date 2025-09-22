import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Heart, ArrowRight } from 'lucide-react';
import './UserRoles.css';

const UserRoles: React.FC = () => {
  const roles = [
    {
      icon: <Shield className="role-icon" />,
      title: "Government Officials",
      description: "Monitor disaster situations, coordinate response efforts, and manage resources effectively across affected areas.",
      features: ["Real-time dashboard", "Resource allocation", "Communication hub", "Analytics reports"],
      action: "Access Dashboard",
      link: "/gov-login",
      color: "blue"
    },
    {
      icon: <Users className="role-icon" />,
      title: "Users in Need",
      description: "Request immediate assistance, find nearby shelters, and stay informed about emergency updates and safety information.",
      features: ["Emergency requests", "Shelter locator", "Safety alerts", "Status updates"],
      action: "Request Help",
      link: "/request-help",
      color: "gold"
    },
    {
      icon: <Heart className="role-icon" />,
      title: "Volunteers",
      description: "Register to help, respond to assistance requests, and coordinate with other volunteers in your community.",
      features: ["Task assignments", "Location tracking", "Communication tools", "Impact metrics"],
      action: "Join Now",
      link: "/volunteer",
      color: "blue"
    }
  ];

  return (
    <section className="section user-roles-section" id="roles">
      <div className="container">
        <h2 className="section-title">Who We Serve</h2>
        <p className="section-subtitle">
          ReliefConnect brings together three essential groups to create an effective disaster response network
        </p>

        <div className="roles-grid">
          {roles.map((role, index) => (
            <div key={index} className={`role-card card role-${role.color}`}>
              <div className="role-header">
                {role.icon}
                <h3 className="role-title">{role.title}</h3>
              </div>
              
              <p className="role-description">{role.description}</p>
              
              <div className="role-features">
                <h4 className="features-title">Key Features:</h4>
                <ul className="features-list">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">{feature}</li>
                  ))}
                </ul>
              </div>
              
              <Link to={role.link} className={`btn ${role.color === 'gold' ? 'btn-secondary' : 'btn-primary'} role-btn`}>
                {role.action}
                <ArrowRight className="btn-icon-right" />
              </Link>
            </div>
          ))}
        </div>

        <div className="roles-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <Shield />
            </div>
            <div className="stat-info">
              <div className="stat-number">50+</div>
              <div className="stat-label">Government Agencies</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Users />
            </div>
            <div className="stat-info">
              <div className="stat-number">25K+</div>
              <div className="stat-label">Citizens Helped</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Heart />
            </div>
            <div className="stat-info">
              <div className="stat-number">5K+</div>
              <div className="stat-label">Active Volunteers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserRoles;