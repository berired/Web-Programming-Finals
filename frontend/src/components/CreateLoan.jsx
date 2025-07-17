import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CreateLoan = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    gender: '',
    marital_status: '',
    dependents: '',
    education: '',
    self_employed: '',
    applicant_income_php: '',
    coapplicant_income_php: '',
    loan_amount_php: '',
    loan_term_days: '360',
    credit_history: '1.0',
    property_area: '',
    loan_category: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert string values to appropriate types
      const requestData = {
        ...formData,
        applicant_income_php: parseFloat(formData.applicant_income_php),
        coapplicant_income_php: parseFloat(formData.coapplicant_income_php) || 0,
        loan_amount_php: parseFloat(formData.loan_amount_php),
        loan_term_days: parseFloat(formData.loan_term_days),
        credit_history: parseFloat(formData.credit_history)
      };

      // Call the backend API
      const response = await fetch('http://localhost:8002/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const result = await response.json();
      setPrediction(result);

      // Save to Firebase
      const loanApplication = {
        userId: currentUser.uid,
        formData: requestData,
        prediction: result,
        createdAt: new Date().toISOString(),
        status: result.loan_approved ? 'approved' : 'denied'
      };

      console.log('Saving loan application:', loanApplication);
      
      const docRef = await addDoc(collection(db, 'loanApplications'), loanApplication);
      console.log('Loan application saved with ID:', docRef.id);

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to process loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getLoanCategoryDescription = (category) => {
    const descriptions = {
      "House Purchase": "For buying residential property, condominiums, or townhouses.",
      "Home Improvement": "For home renovations, repairs, extensions, or interior upgrades.",
      "Car": "For purchasing new or used automobiles, SUVs, or other passenger vehicles.",
      "Motorcycle": "For buying motorcycles, scooters, or other two-wheeled vehicles.",
      "Personal Loan": "For personal expenses, travel, gadgets, events, or other individual needs.",
      "Educational Loan": "For tuition fees, school supplies, educational courses, or training programs.",
      "Medical Loan": "For medical treatments, surgeries, dental work, or health-related expenses.",
      "Business Loan": "For starting a new business, expanding operations, or business equipment."
    };
    return descriptions[category] || "";
  };

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
              <Link to="/loan-history" className="btn btn-secondary">
                History
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
          <div className="loan-form-container">
            <div className="loan-form-card">
              <div className="loan-form-header">
                <div className="loan-form-icon">
                  <div className="icon-circle">
                    <i className="fas fa-file-invoice-dollar"></i>
                  </div>
                </div>
                <div className="loan-form-title-section">
                  <h1 className="loan-form-title">Loan Application</h1>
                  <p className="loan-form-subtitle">
                    Get instant loan approval prediction with our advanced AI system
                  </p>
                </div>
              </div>

              <div className="loan-form-body">
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="loan-form">
                  {/* Personal Information */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-icon">
                        <i className="fas fa-user"></i>
                      </div>
                      <h3 className="section-title">Personal Information</h3>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-venus-mars"></i>
                          Gender
                        </label>
                        <select
                          name="gender"
                          className="form-select custom-select"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Lalaki">Male (Lalaki)</option>
                          <option value="Babae">Female (Babae)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-heart"></i>
                          Marital Status
                        </label>
                        <select
                          name="marital_status"
                          className="form-select custom-select"
                          value={formData.marital_status}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Marital Status</option>
                          <option value="Single">Single</option>
                          <option value="Kasal">Married (Kasal)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-users"></i>
                          Number of Dependents
                        </label>
                        <select
                          name="dependents"
                          className="form-select custom-select"
                          value={formData.dependents}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Dependents</option>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3+">3+</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-graduation-cap"></i>
                          Education Level
                        </label>
                        <select
                          name="education"
                          className="form-select custom-select"
                          value={formData.education}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Education</option>
                          <option value="High School/Vocational">High School/Vocational</option>
                          <option value="College Graduate">College Graduate</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-briefcase"></i>
                        Self Employed
                      </label>
                      <select
                        name="self_employed"
                        className="form-select custom-select"
                        value={formData.self_employed}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Employment Type</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-icon">
                        <i className="fas fa-dollar-sign"></i>
                      </div>
                      <h3 className="section-title">Financial Information</h3>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-wallet"></i>
                          Your Monthly Income (PHP)
                        </label>
                        <input
                          type="number"
                          name="applicant_income_php"
                          className="form-input"
                          placeholder="e.g., 50,000"
                          value={formData.applicant_income_php}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-user-friends"></i>
                          Co-applicant Monthly Income (PHP)
                        </label>
                        <input
                          type="number"
                          name="coapplicant_income_php"
                          className="form-input"
                          placeholder="0 if none"
                          value={formData.coapplicant_income_php}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-coins"></i>
                          Loan Amount (PHP)
                        </label>
                        <input
                          type="number"
                          name="loan_amount_php"
                          className="form-input"
                          placeholder="e.g., 500,000"
                          value={formData.loan_amount_php}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-calendar-alt"></i>
                          Loan Term (Days)
                        </label>
                        <select
                          name="loan_term_days"
                          className="form-select custom-select"
                          value={formData.loan_term_days}
                          onChange={handleChange}
                          required
                        >
                          <option value="30">30 days (1 month)</option>
                          <option value="60">60 days (2 months)</option>
                          <option value="90">90 days (3 months)</option>
                          <option value="120">120 days (4 months)</option>
                          <option value="180">180 days (6 months)</option>
                          <option value="240">240 days (8 months)</option>
                          <option value="360">360 days (12 months)</option>
                          <option value="480">480 days (16 months)</option>
                          <option value="600">600 days (20 months)</option>
                          <option value="720">720 days (24 months)</option>
                          <option value="1080">1080 days (36 months)</option>
                          <option value="1440">1440 days (48 months)</option>
                          <option value="1800">1800 days (60 months)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-credit-card"></i>
                        Credit History
                      </label>
                      <select
                        name="credit_history"
                        className="form-select custom-select"
                        value={formData.credit_history}
                        onChange={handleChange}
                        required
                      >
                        <option value="1.0">Good Credit History</option>
                        <option value="0.0">Poor Credit History</option>
                      </select>
                    </div>
                  </div>

                  {/* Property and Loan Details */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-icon">
                        <i className="fas fa-home"></i>
                      </div>
                      <h3 className="section-title">Property & Loan Details</h3>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-map-marker-alt"></i>
                          Property Area
                        </label>
                        <select
                          name="property_area"
                          className="form-select custom-select"
                          value={formData.property_area}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Area</option>
                          <option value="Metro Manila">Metro Manila</option>
                          <option value="Provincial Cities">Provincial Cities</option>
                          <option value="Rural Provinces">Rural Provinces</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-tag"></i>
                          Loan Category
                        </label>
                        <select
                          name="loan_category"
                          className="form-select custom-select"
                          value={formData.loan_category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="House Purchase">🏠 House Purchase</option>
                          <option value="Home Improvement">🔧 Home Improvement</option>
                          <option value="Car">🚗 Car</option>
                          <option value="Motorcycle">🏍️ Motorcycle</option>
                          <option value="Personal Loan">💰 Personal Loan</option>
                          <option value="Educational Loan">📚 Educational Loan</option>
                          <option value="Medical Loan">🏥 Medical Loan</option>
                          <option value="Business Loan">🏢 Business Loan</option>
                        </select>
                        {formData.loan_category && (
                          <div className="category-description">
                            <i className="fas fa-info-circle"></i>
                            {getLoanCategoryDescription(formData.loan_category)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-submit-section">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-calculator"></i>
                          Get Loan Prediction
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Prediction Results */}
            {prediction && (
              <div className={`prediction-result-card ${!prediction.loan_approved ? 'denied' : 'approved'}`}>
                <div className="prediction-header">
                  <div className="prediction-icon">
                    <div className={`icon-circle ${prediction.loan_approved ? 'success' : 'danger'}`}>
                      {prediction.loan_approved ? (
                        <i className="fas fa-check"></i>
                      ) : (
                        <i className="fas fa-times"></i>
                      )}
                    </div>
                  </div>
                  <div className="prediction-title-section">
                    <h2 className={`prediction-status ${prediction.loan_approved ? 'approved' : 'denied'}`}>
                      {prediction.loan_approved ? 'Loan Approved!' : 'Loan Not Approved'}
                    </h2>
                    <p className="prediction-subtitle">
                      Based on your application details
                    </p>
                  </div>
                </div>

                <div className="prediction-details">
                  <div className="prediction-detail">
                    <div className="detail-icon">
                      <i className="fas fa-percentage"></i>
                    </div>
                    <div className="detail-content">
                      <div className="detail-value">
                        {formatPercentage(prediction.approval_probability)}
                      </div>
                      <div className="detail-label">Approval Probability</div>
                    </div>
                  </div>
                  
                  <div className="prediction-detail">
                    <div className="detail-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <div className="detail-content">
                      <div className="detail-value" style={{ 
                        color: prediction.risk_level === 'Low Risk' ? '#22c55e' :
                               prediction.risk_level === 'Medium Risk' ? '#f59e0b' : '#ef4444'
                      }}>
                        {prediction.risk_level}
                      </div>
                      <div className="detail-label">Risk Assessment</div>
                    </div>
                  </div>
                  
                  <div className="prediction-detail">
                    <div className="detail-icon">
                      <i className="fas fa-coins"></i>
                    </div>
                    <div className="detail-content">
                      <div className="detail-value">
                        {formatCurrency(formData.loan_amount_php)}
                      </div>
                      <div className="detail-label">Requested Amount</div>
                    </div>
                  </div>
                </div>

                {prediction.recommendations && prediction.recommendations.length > 0 && (
                  <div className="recommendations">
                    <h4>
                      <i className="fas fa-lightbulb"></i>
                      Recommendations
                    </h4>
                    <ul>
                      {prediction.recommendations.map((recommendation, index) => (
                        <li key={index}>
                          <i className="fas fa-arrow-right"></i>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="prediction-actions">
                  <Link to="/loan-history" className="btn btn-primary">
                    <i className="fas fa-history"></i>
                    View Loan History
                  </Link>
                  <button 
                    onClick={() => {
                      setPrediction(null);
                      setFormData({
                        gender: '',
                        marital_status: '',
                        dependents: '',
                        education: '',
                        self_employed: '',
                        applicant_income_php: '',
                        coapplicant_income_php: '',
                        loan_amount_php: '',
                        loan_term_days: '360',
                        credit_history: '1.0',
                        property_area: '',
                        loan_category: ''
                      });
                    }}
                    className="btn btn-secondary"
                  >
                    <i className="fas fa-plus"></i>
                    New Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateLoan;
