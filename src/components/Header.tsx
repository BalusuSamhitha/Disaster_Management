import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Shield } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <Shield className="logo-icon" />
            <span>ReliefConnect</span>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link to="/features" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Features
            </Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="nav-link logout-btn"
                >
                  Logout ({user?.name})
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="nav-link login-link" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;