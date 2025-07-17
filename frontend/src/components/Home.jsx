import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!userProfile) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/home" className="navbar-brand">
              LAP
            </Link>
            <div className="navbar-nav">
              <span style={{ color: 'var(--white)', fontSize: '0.9rem', fontWeight: '500' }}>
                Welcome, {userProfile.firstName}
              </span>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* User Profile Section */}
          <div className="dashboard-container">
            <div className="user-welcome">
              <div className="user-avatar">
                {getInitials(userProfile.firstName, userProfile.lastName)}
              </div>
              <div className="welcome-text">
                <h2>Welcome back, {userProfile.firstName}!</h2>
                <p>Member since {formatDate(userProfile.memberSince)}</p>
              </div>
            </div>

            <h2 className="dashboard-title">What would you like to do?</h2>

            {/* Dashboard Grid */}
            <div className="dashboard-grid">
              {/* Create Loan Card */}
              <div className="dashboard-card blue">
                <div className="dashboard-icon" style={{ color: '#3b82f6' }}>
                  💰
                </div>
                <h3>Apply for a Loan</h3>
                <p>
                  Get instant predictions on your loan approval chances with our AI-powered system.
                </p>
                <Link to="/create-loan" className="btn btn-primary">
                  Create Application
                </Link>
              </div>

              {/* Loan History Card */}
              <div className="dashboard-card green">
                <div className="dashboard-icon" style={{ color: 'var(--primary-green)' }}>
                  📊
                </div>
                <h3>Loan History</h3>
                <p>
                  View all your previous loan applications and their status.
                </p>
                <Link to="/loan-history" className="btn btn-primary">
                  View History
                </Link>
              </div>

              {/* Account Details Card */}
              <div className="dashboard-card orange">
                <div className="dashboard-icon" style={{ color: '#f97316' }}>
                  👤
                </div>
                <h3>Account Details</h3>
                <div style={{ textAlign: 'left', fontSize: '0.9rem' }}>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Email:</strong> {userProfile.email}
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Username:</strong> @{userProfile.username}
                  </p>
                  <p>
                    <strong>Status:</strong> Active Member
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Information */}
          <div className="dashboard-container">
            <h3 className="responsive-title" style={{ 
              fontWeight: '700', 
              color: 'var(--text-dark)', 
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              About LAP - Loan Approval Predictor
            </h3>
            
            <div className="responsive-grid" style={{ marginBottom: '2rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--light-green) 0%, #f0fdf4 100%)',
                padding: '2rem',
                borderRadius: '16px',
                border: '2px solid var(--primary-green)'
              }}>
                <h4 className="responsive-heading" style={{ 
                  color: 'var(--text-dark)', 
                  marginBottom: '1rem' 
                }}>
                  🎯 Smart Predictions
                </h4>
                <p className="responsive-text" style={{ 
                  color: 'var(--text-light)' 
                }}>
                  Our advanced AI analyzes your financial profile using Philippine market data to provide accurate loan approval predictions.
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                padding: '2rem',
                borderRadius: '16px',
                border: '2px solid #3b82f6'
              }}>
                <h4 className="responsive-heading" style={{ 
                  color: 'var(--text-dark)', 
                  marginBottom: '1rem' 
                }}>
                  ⚡ Instant Results
                </h4>
                <p className="responsive-text" style={{ 
                  color: 'var(--text-light)' 
                }}>
                  Get immediate feedback on your loan application with detailed recommendations for improvement.
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                padding: '2rem',
                borderRadius: '16px',
                border: '2px solid #f97316'
              }}>
                <h4 className="responsive-heading" style={{ 
                  color: 'var(--text-dark)', 
                  marginBottom: '1rem' 
                }}>
                  📈 Track Progress
                </h4>
                <p className="responsive-text" style={{ 
                  color: 'var(--text-light)' 
                }}>
                  Monitor all your loan applications and track your approval history in one convenient dashboard.
                </p>
              </div>
            </div>

            <div style={{ 
              padding: '2rem', 
              background: 'linear-gradient(135deg, var(--light-green) 0%, #bbf7d0 100%)', 
              borderRadius: '16px',
              border: '3px solid var(--primary-green)',
              textAlign: 'center'
            }}>
              <h4 className="responsive-heading" style={{ 
                color: 'var(--text-dark)', 
                marginBottom: '1rem',
                fontWeight: '700'
              }}>
                💡 Pro Tip
              </h4>
              <p className="responsive-text" style={{ 
                color: 'var(--text-dark)', 
                fontWeight: '500'
              }}>
                Provide accurate information for the most reliable predictions. Our system considers income, 
                credit history, and loan category to give you the best possible assessment.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
