import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard">
            <FaHome className="brand-icon" />
            <span>Travel Mitr</span>
          </Link>
        </div>

        <div className="nav-menu">
          <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
            <FaHome /> Dashboard
          </Link>
          <Link to="/history" className={`nav-item ${isActive('/history')}`}>
            <FaHistory /> History
          </Link>
          <Link to="/profile" className={`nav-item ${isActive('/profile')}`}>
            <FaUser /> Profile
          </Link>
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
          </div>
          <button onClick={onLogout} className="nav-logout">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

