import requests
import json

# Test data for API
test_cases = [
    {
        "name": "High Income College Graduate",
        "data": {
            "gender": "Lalaki",
            "marital_status": "Kasal",
            "dependents": "2",
            "education": "College Graduate",
            "self_employed": "No",
            "applicant_income_php": 800000,
            "coapplicant_income_php": 300000,
            "loan_amount_php": 1500000,
            "loan_term_days": 360,
            "credit_history": 1.0,
            "property_area": "Metro Manila",
            "loan_category": "House Purchase"
        }
    },
    {
        "name": "Low Income High School Graduate",
        "data": {
            "gender": "Babae",
            "marital_status": "Single",
            "dependents": "0",
            "education": "High School/Vocational",
            "self_employed": "Yes",
            "applicant_income_php": 250000,
            "coapplicant_income_php": 0,
            "loan_amount_php": 800000,
            "loan_term_days": 360,
            "credit_history": 0.0,
            "property_area": "Rural Provinces",
            "loan_category": "Small Business/Motorcycle"
        }
    },
    {
        "name": "Medium Income Good Credit",
        "data": {
            "gender": "Lalaki",
            "marital_status": "Single",
            "dependents": "1",
            "education": "College Graduate",
            "self_employed": "No",
            "applicant_income_php": 600000,
            "coapplicant_income_php": 200000,
            "loan_amount_php": 1200000,
            "loan_term_days": 360,
            "credit_history": 1.0,
            "property_area": "Provincial Cities",
            "loan_category": "Home Improvement/Car"
        }
    }
]

def test_api():
    base_url = "http://localhost:8001"
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        print("Health Check:", response.json())
        print()
    except Exception as e:
        print(f"Health check failed: {e}")
        return
    
    # Test prediction endpoint
    for test_case in test_cases:
        print(f"Testing: {test_case['name']}")
        try:
            response = requests.post(
                f"{base_url}/predict",
                json=test_case['data']
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"  Approved: {result['loan_approved']}")
                print(f"  Probability: {result['approval_probability']:.3f}")
                print(f"  Risk Level: {result['risk_level']}")
                print(f"  Recommendations: {result['recommendations']}")
            else:
                print(f"  Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"  Request failed: {e}")
        print()

if __name__ == "__main__":
    test_api()
