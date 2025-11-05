import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaMapMarkerAlt, FaRoute, FaWallet, FaClock, FaChartLine } from 'react-icons/fa';
import { tripAPI, destinationAPI } from '../../services/api';
import Navbar from '../Common/Navbar';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [sourceId, setSourceId] = useState('');
  const [destId, setDestId] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [sourceSearch, setSourceSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [searchResults, setSearchResults] = useState({ source: [], dest: [] });
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [costWeight, setCostWeight] = useState(40);
  const [timeWeight, setTimeWeight] = useState(30);
  const [comfortWeight, setComfortWeight] = useState(30);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const response = await destinationAPI.getAll();
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Failed to load destinations:', error);
    }
  };

  const handleSourceSearch = (value) => {
    setSourceSearch(value);
    if (value) {
      const filtered = destinations.filter(d => 
        d.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults({ ...searchResults, source: filtered });
    } else {
      setSearchResults({ ...searchResults, source: [] });
    }
  };

  const handleDestSearch = (value) => {
    setDestSearch(value);
    if (value) {
      const filtered = destinations.filter(d => 
        d.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults({ ...searchResults, dest: filtered });
    } else {
      setSearchResults({ ...searchResults, dest: [] });
    }
  };

  const selectSource = (dest) => {
    setSourceId(dest.dest_id);
    setSourceSearch(dest.name);
    setSearchResults({ ...searchResults, source: [] });
  };

  const selectDest = (dest) => {
    setDestId(dest.dest_id);
    setDestSearch(dest.name);
    setSearchResults({ ...searchResults, dest: [] });
  };

  const handleOptimize = async (e) => {
    e.preventDefault();
    setError('');
    setOptimizationResult(null);

    // If ids are present use DB route; else try free text
    if (sourceId && destId && sourceId === destId) {
      setError('Source and destination cannot be the same');
      return;
    }

    setLoading(true);

    try {
      let response;
      if (sourceId && destId) {
        response = await tripAPI.optimize(
          sourceId,
          destId,
          costWeight / 100,
          timeWeight / 100,
          comfortWeight / 100
        );
      } else if (sourceSearch && destSearch) {
        response = await tripAPI.optimizeByText(
          sourceSearch,
          destSearch,
          costWeight / 100,
          timeWeight / 100,
          comfortWeight / 100
        );
      } else {
        setError('Please enter both source and destination');
        setLoading(false);
        return;
      }
      setOptimizationResult(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to optimize route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="dashboard-container">
        <div className="container">
          <div className="page-header">
            <h1><FaPlane /> Find Your Best Travel Route</h1>
            <p>Compare prices from multiple platforms and get the most optimized travel plan</p>
          </div>

          <div className="dashboard-grid">
            <div className="search-panel">
              <div className="card">
                <h2 className="card-title">Search Route</h2>
                
                <form onSubmit={handleOptimize}>
                  {error && <div className="alert alert-error">{error}</div>}

                  <div className="form-group">
                    <label><FaMapMarkerAlt /> From</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search source destination"
                      value={sourceSearch}
                      onChange={(e) => handleSourceSearch(e.target.value)}
                    />
                    {searchResults.source.length > 0 && (
                      <div className="dropdown-results">
                        {searchResults.source.map(dest => (
                          <div
                            key={dest.dest_id}
                            className="dropdown-item"
                            onClick={() => selectSource(dest)}
                          >
                            <strong>{dest.name}</strong>
                            <small>{dest.city}, {dest.state}</small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label><FaRoute /> To</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search destination"
                      value={destSearch}
                      onChange={(e) => handleDestSearch(e.target.value)}
                    />
                    {searchResults.dest.length > 0 && (
                      <div className="dropdown-results">
                        {searchResults.dest.map(dest => (
                          <div
                            key={dest.dest_id}
                            className="dropdown-item"
                            onClick={() => selectDest(dest)}
                          >
                            <strong>{dest.name}</strong>
                            <small>{dest.city}, {dest.state}</small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="preferences-section">
                    <h3>Optimization Preferences</h3>
                    <div className="preference-item">
                      <label>Cost Priority: <span>{costWeight}%</span></label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={costWeight}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setCostWeight(val);
                          const remaining = 100 - val;
                          setTimeWeight(Math.floor(remaining / 2));
                          setComfortWeight(remaining - Math.floor(remaining / 2));
                        }}
                      />
                    </div>
                    <div className="preference-item">
                      <label>Time Priority: <span>{timeWeight}%</span></label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={timeWeight}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setTimeWeight(val);
                          const remaining = 100 - val;
                          setCostWeight(Math.floor(remaining / 2));
                          setComfortWeight(remaining - Math.floor(remaining / 2));
                        }}
                      />
                    </div>
                    <div className="preference-item">
                      <label>Comfort Priority: <span>{comfortWeight}%</span></label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={comfortWeight}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setComfortWeight(val);
                          const remaining = 100 - val;
                          setCostWeight(Math.floor(remaining / 2));
                          setTimeWeight(remaining - Math.floor(remaining / 2));
                        }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Optimizing...' : <><FaChartLine /> Find Best Route</>}
                  </button>
                </form>
              </div>
            </div>

            {optimizationResult && (
              <div className="results-panel">
                <div className="card recommendation-card">
                  <div className="card-header">
                    <h2 className="card-title">🌟 Recommended Route</h2>
                  </div>
                  <div className="recommendation-content">
                    <div className="recommendation-item">
                      <FaRoute className="icon" />
                      <div>
                        <strong>Mode</strong>
                        <p>{optimizationResult.recommendation.mode}</p>
                      </div>
                    </div>
                    <div className="recommendation-item">
                      <FaWallet className="icon" />
                      <div>
                        <strong>Cost</strong>
                        <p>₹{optimizationResult.recommendation.totalCost}</p>
                      </div>
                    </div>
                    <div className="recommendation-item">
                      <FaClock className="icon" />
                      <div>
                        <strong>Duration</strong>
                        <p>{optimizationResult.recommendation.totalDuration} min</p>
                      </div>
                    </div>
                  </div>
                  {optimizationResult.recommendation.appName !== 'Direct' && (
                    <div className="app-badge">
                      {optimizationResult.recommendation.appName}
                    </div>
                  )}
                  <div className="score-badge">
                    Optimization Score: {optimizationResult.recommendation.score}/100
                  </div>
                </div>

                <div className="card">
                  <h2 className="card-title">All Available Options</h2>
                  <div className="options-list">
                    {optimizationResult.allOptions.map((option, index) => (
                      <div key={index} className="option-card">
                        <div className="option-header">
                          <h3>{option.mode}</h3>
                          {option.appName !== 'Direct' && (
                            <span className="app-tag">{option.appName}</span>
                          )}
                        </div>
                        <div className="option-details">
                          <div className="detail-item">
                            <FaWallet /> ₹{option.cost}
                          </div>
                          <div className="detail-item">
                            <FaClock /> {option.duration} min
                          </div>
                          <div className="detail-item">
                            Comfort: {option.comfort}/10
                          </div>
                        </div>
                        {option.rides && option.rides.length > 0 && (
                          <div className="rides-list">
                            {option.rides.map((ride, ridx) => (
                              <div key={ridx} className="ride-item">
                                {ride.app_name}: ₹{ride.fare} ({ride.estimated_time} min)
                                {ride.deeplink && (
                                  <a className="deeplink" href={ride.deeplink} target="_blank" rel="noreferrer"> Book</a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

