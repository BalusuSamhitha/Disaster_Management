import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GovernmentDashboard from './GovernmentDashboard';
import UserDashboard from './UserDashboard';
import VolunteerDashboard from './VolunteerDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Route to appropriate dashboard based on user role
  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'government':
      return <GovernmentDashboard />;
    case 'user':
      return <UserDashboard />;
    case 'volunteer':
      return <VolunteerDashboard />;
    default:
      return <UserDashboard />; // Default to user dashboard
  }
};

export default Dashboard;