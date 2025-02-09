import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `navbar ${isScrolled ? 'scrolled' : ''} ${location.pathname === '/' ? 'home' : ''}`;

  return (
    <nav className={navClass}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          <Lightbulb className="logo-icon" />
          <span className="logo-text">Lumify</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/enhance">Enhance</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/team">Team</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
      </div>
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