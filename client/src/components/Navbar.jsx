import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lightbulb, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu when navigating to a new page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navClass = `navbar ${isScrolled ? 'scrolled' : ''} ${
    location.pathname === '/' ? 'home' : ''
  }`;

  return (
    <nav className={navClass}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <Lightbulb className="logo-icon" />
          <span className="logo-text">Lumify</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <div className="nav-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/enhance">Enhance</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/team">Team</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? (
            <X size={24} color="#facc15" />
          ) : (
            <Menu size={24} color="#facc15" />
          )}
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/enhance">Enhance</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/team">Team</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
};

export default Navbar;
