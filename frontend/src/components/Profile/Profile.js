import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave } from 'react-icons/fa';
import Navbar from '../Common/Navbar';
import './Profile.css';

const Profile = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || ''
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    // In a real app, this would call an API to update the profile
    alert('Profile updated successfully! (Demo mode)');
    setIsEditing(false);
  };

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="profile-container">
        <div className="container">
          <div className="page-header">
            <h1><FaUser /> Profile</h1>
            <p>Manage your account information</p>
          </div>

          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <span>{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <h2>{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label>
                  <FaUser className="label-icon" /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="profile-value">{formData.name}</div>
                )}
              </div>

              <div className="form-group">
                <label>
                  <FaEnvelope className="label-icon" /> Email
                </label>
                <div className="profile-value">{user?.email}</div>
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label>
                  <FaPhone className="label-icon" /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="profile-value">{formData.phone}</div>
                )}
              </div>

              <div className="profile-actions">
                {isEditing ? (
                  <button className="btn btn-primary" onClick={handleSave}>
                    <FaSave /> Save Changes
                  </button>
                ) : (
                  <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                    <FaEdit /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Account Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">User ID</div>
                <div className="stat-label">{user?.userId}</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">Member Since</div>
                <div className="stat-label">Today</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

