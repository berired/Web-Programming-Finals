import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const LoanHistory = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchLoanHistory = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching loan history for user:', currentUser.uid);
      
      const q = query(
        collection(db, 'loanApplications'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const loanData = [];
      
      console.log('Query snapshot size:', querySnapshot.size);
      
      querySnapshot.forEach((doc) => {
        console.log('Document data:', doc.data());
        loanData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('Fetched loan data:', loanData);
      setLoans(loanData);
    } catch (error) {
      console.error('Error fetching loan history:', error);
      
      // Try fetching without orderBy in case there's no index
      try {
        console.log('Retrying without orderBy...');
        const q = query(
          collection(db, 'loanApplications'),
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const loanData = [];
        
        querySnapshot.forEach((doc) => {
          loanData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Sort manually by createdAt
        loanData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        console.log('Fetched loan data (without orderBy):', loanData);
        setLoans(loanData);
      } catch (retryError) {
        console.error('Retry error:', retryError);
        setError('Failed to load loan history. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchLoanHistory();
    }
  }, [currentUser]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (approved) => {
    return (
      <span className={`status-badge ${approved ? 'approved' : 'denied'}`}>
        {approved ? 'Approved' : 'Denied'}
      </span>
    );
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low Risk':
        return '#48bb78';
      case 'Medium Risk':
        return '#ed8936';
      case 'High Risk':
        return '#f56565';
      default:
        return '#718096';
    }
  };

  if (loading) {
    return (
      <div>
        <nav className="navbar">
          <div className="container">
            <div className="navbar-content">
              <Link to="/home" className="navbar-brand">
                LendScore
              </Link>
              <div className="navbar-nav">
                <Link to="/home" className="btn btn-secondary">
                  Home
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="loading">
          <div className="spinner"></div>
        </div>
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
              LendScore
            </Link>
            <div className="navbar-nav">
              <Link to="/home" className="btn btn-secondary">
                Home
              </Link>
              <Link to="/create-loan" className="btn btn-primary">
                New Application
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="loan-history">
            <div className="card">
              <div className="card-header">
                <h1 className="card-title">Loan Application History</h1>
                <p style={{ color: '#718096', marginTop: '0.5rem' }}>
                  Track all your loan applications and their status
                </p>
              </div>

              {error && <div className="error-message">{error}</div>}

              {loans.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
                  <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>
                    No Loan Applications Yet
                  </h3>
                  <p style={{ color: '#718096', marginBottom: '2rem' }}>
                    You haven't submitted any loan applications. Start by creating your first application.
                  </p>
                  <Link to="/create-loan" className="btn btn-primary">
                    Create Your First Application
                  </Link>
                </div>
              ) : (
                <div>
                  {/* Summary Stats */}
                  <div className="prediction-details" style={{ marginBottom: '2rem' }}>
                    <div className="prediction-detail">
                      <div className="detail-value">{loans.length}</div>
                      <div className="detail-label">Total Applications</div>
                    </div>
                    <div className="prediction-detail">
                      <div className="detail-value" style={{ color: '#48bb78' }}>
                        {loans.filter(loan => loan.prediction?.loan_approved).length}
                      </div>
                      <div className="detail-label">Approved</div>
                    </div>
                    <div className="prediction-detail">
                      <div className="detail-value" style={{ color: '#f56565' }}>
                        {loans.filter(loan => !loan.prediction?.loan_approved).length}
                      </div>
                      <div className="detail-label">Denied</div>
                    </div>
                    <div className="prediction-detail">
                      <div className="detail-value">
                        {loans.length > 0 ? 
                          formatPercentage(
                            loans.filter(loan => loan.prediction?.loan_approved).length / loans.length
                          ) : '0%'
                        }
                      </div>
                      <div className="detail-label">Success Rate</div>
                    </div>
                  </div>

                  {/* Loan Applications List */}
                  <div>
                    {loans.map((loan) => (
                      <div key={loan.id} className="loan-item">
                        <div className="loan-header">
                          <div>
                            <h3 style={{ 
                              color: '#2d3748', 
                              marginBottom: '0.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem'
                            }}>
                              {loan.formData?.loan_category || 'Loan Application'}
                              {getStatusBadge(loan.prediction?.loan_approved)}
                            </h3>
                            <p className="loan-date">
                              Applied on {formatDate(loan.createdAt)}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                              fontSize: '1.5rem', 
                              fontWeight: '600',
                              color: '#2d3748'
                            }}>
                              {formatCurrency(loan.formData?.loan_amount_php || 0)}
                            </div>
                            <div style={{ 
                              color: getRiskColor(loan.prediction?.risk_level),
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}>
                              {loan.prediction?.risk_level || 'N/A'}
                            </div>
                          </div>
                        </div>

                        <div className="loan-details">
                          <div className="loan-detail">
                            <div className="loan-detail-value">
                              {formatPercentage(loan.prediction?.approval_probability || 0)}
                            </div>
                            <div className="loan-detail-label">Approval Probability</div>
                          </div>
                          
                          <div className="loan-detail">
                            <div className="loan-detail-value">
                              {formatCurrency(loan.formData?.applicant_income_php || 0)}
                            </div>
                            <div className="loan-detail-label">Monthly Income</div>
                          </div>
                          
                          <div className="loan-detail">
                            <div className="loan-detail-value">
                              {loan.formData?.loan_term_days || 0} days
                            </div>
                            <div className="loan-detail-label">Loan Term</div>
                          </div>
                          
                          <div className="loan-detail">
                            <div className="loan-detail-value">
                              {loan.formData?.property_area || 'N/A'}
                            </div>
                            <div className="loan-detail-label">Property Area</div>
                          </div>
                          
                          <div className="loan-detail">
                            <div className="loan-detail-value">
                              {loan.formData?.education || 'N/A'}
                            </div>
                            <div className="loan-detail-label">Education</div>
                          </div>
                          
                          <div className="loan-detail">
                            <div className="loan-detail-value">
                              {loan.formData?.credit_history === 1.0 ? 'Good' : 'Poor'}
                            </div>
                            <div className="loan-detail-label">Credit History</div>
                          </div>
                        </div>

                        {loan.prediction?.recommendations && loan.prediction.recommendations.length > 0 && (
                          <div className="recommendations" style={{ marginTop: '1rem' }}>
                            <h4>Recommendations:</h4>
                            <ul>
                              {loan.prediction.recommendations.map((recommendation, index) => (
                                <li key={index}>{recommendation}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <Link to="/create-loan" className="btn btn-primary">
                  📝 New Application
                </Link>
                <button 
                  onClick={fetchLoanHistory}
                  className="btn btn-secondary"
                >
                  🔄 Refresh History
                </button>
                <Link to="/home" className="btn btn-secondary">
                  🏠 Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoanHistory;
