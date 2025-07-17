import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavigationTest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  const testLinks = [
    { path: '/home', label: 'Home' },
    { path: '/create-loan', label: 'Create Loan' },
    { path: '/loan-history', label: 'Loan History' },
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' }
  ];

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      zIndex: 1000,
      fontSize: '12px'
    }}>
      <h4>Navigation Test</h4>
      <p>Current Path: {location.pathname}</p>
      
      <div style={{ marginTop: '10px' }}>
        <h5>Link Navigation:</h5>
        {testLinks.map(link => (
          <div key={link.path} style={{ margin: '5px 0' }}>
            <Link 
              to={link.path} 
              style={{ 
                color: 'blue', 
                textDecoration: 'none',
                marginRight: '10px' 
              }}
              onClick={() => console.log(`Link clicked: ${link.path}`)}
            >
              {link.label}
            </Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <h5>Programmatic Navigation:</h5>
        {testLinks.map(link => (
          <button 
            key={`btn-${link.path}`}
            onClick={() => handleNavigate(link.path)}
            style={{ 
              display: 'block',
              margin: '2px 0',
              padding: '2px 5px',
              fontSize: '10px'
            }}
          >
            Go to {link.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTest;
