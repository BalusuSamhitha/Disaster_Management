import React from 'react';
import { MapPin, Bell, Users, BarChart3, Shield, Zap, Globe, Smartphone } from 'lucide-react';
import './Features.css';

const Features: React.FC = () => {
  const mainFeatures = [
    
    
    {
      icon: <Users className="feature-icon" />,
      title: "Volunteer Coordination",
      description: "Streamlined volunteer management with task assignment and progress tracking capabilities.",
      benefits: ["Task matching", "Skill-based assignments", "Progress monitoring", "Team communication"]
    },
    
  ];

  const additionalFeatures = [
    {
      icon: <Shield className="icon" />,
      title: "Secure Communications",
      description: "End-to-end encrypted messaging for sensitive disaster response coordination."
    },
    {
      icon: <Zap className="icon" />,
      title: "Rapid Response",
      description: "Sub-30 second response times for critical emergency requests and updates."
    },
    
    {
      icon: <Smartphone className="icon" />,
      title: "Mobile-first Design",
      description: "Optimized for mobile devices to work in any situation or environment."
    }
  ];

  return (
    <section className="section features-section" id="features">
      <div className="container">
        <h2 className="section-title">Powerful Features</h2>
        <p className="section-subtitle">
          Comprehensive tools designed to enhance disaster response coordination and save lives
        </p>

        <div className="main-features-grid">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="main-feature-card card">
              <div className="feature-header">
                {feature.icon}
                <h3 className="feature-title">{feature.title}</h3>
              </div>
              
              <p className="feature-description">{feature.description}</p>
              
              <div className="feature-benefits">
                <h4 className="benefits-title">Key Benefits:</h4>
                <ul className="benefits-list">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="benefit-item">{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="additional-features">
          <h3 className="additional-title">Additional Capabilities</h3>
          <div className="additional-grid">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="additional-feature-card">
                {feature.icon}
                <div className="additional-content">
                  <h4 className="additional-feature-title">{feature.title}</h4>
                  <p className="additional-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="features-cta">
          <div className="cta-content">
            <h3 className="cta-title">Ready to Experience These Features?</h3>
            <p className="cta-description">
              Join thousands of organizations worldwide using ReliefConnect for disaster management
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Get Started Today</button>
              <button className="btn btn-outline">Schedule Demo</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;