import React from 'react';
import { Target, Globe, Users, Zap } from 'lucide-react';
import './About.css';

const About: React.FC = () => {
  const values = [
    {
      icon: <Target className="icon" />,
      title: "Mission-Driven",
      description: "Dedicated to saving lives and reducing suffering during disasters through technology and coordination."
    },
    {
      icon: <Globe className="icon" />,
      title: "Global Reach",
      description: "Operating worldwide to provide disaster relief coordination wherever and whenever needed."
    },
    {
      icon: <Users className="icon" />,
      title: "Community-Focused",
      description: "Bringing together volunteers, officials, and citizens to create stronger disaster response networks."
    },
    {
      icon: <Zap className="icon" />,
      title: "Real-Time Response",
      description: "Providing instant communication and coordination capabilities during critical emergency situations."
    }
  ];

  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">About ReliefConnect</h2>
            <p className="section-subtitle">
              ReliefConnect is a comprehensive disaster management platform designed to bridge the gap 
              between those who need help and those who can provide it during natural disasters and emergencies.
            </p>
            
            <div className="about-description">
              <p>
                Our platform serves as a vital communication hub, connecting government officials who monitor 
                and manage disaster response, users in need who require immediate assistance, and volunteers 
                who are ready to help their communities.
              </p>
              <p>
                Through real-time coordination, location-based services, and integrated analytics, 
                ReliefConnect ensures that help reaches those who need it most, when they need it most.
              </p>
            </div>

            <div className="about-metrics">
              <div className="metric">
                <div className="metric-number">99.9%</div>
                <div className="metric-label">Uptime Reliability</div>
              </div>
              <div className="metric">
                <div className="metric-number">&lt;30s</div>
                <div className="metric-label">Response Time</div>
              </div>
              <div className="metric">
                <div className="metric-number">150+</div>
                <div className="metric-label">Countries Served</div>
              </div>
            </div>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card card">
                {value.icon}
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;