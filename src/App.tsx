import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import UserRoles from './components/UserRoles';
import Features from './components/Features';

import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestHelp from './pages/RequestHelp';
import VolunteerRegistration from './pages/VolunteerRegistration';

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <UserRoles />
      <Features />
      
      <Contact />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/request-help" element={<RequestHelp />} />
              <Route path="/volunteer" element={<VolunteerRegistration />} />
              <Route path="/gov-login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;