# Loan Approval Predictor Backend

A machine learning-powered backend API for predicting loan approval decisions based on Philippine loan data.

## Features

- **Machine Learning Model**: Random Forest Classifier trained on Philippine loan data
- **RESTful API**: FastAPI-based backend with automatic documentation
- **Web Interface**: Simple HTML form for testing the prediction model
- **Data Processing**: Automatic feature engineering and preprocessing
- **Risk Assessment**: Provides approval probability and risk levels
- **Recommendations**: Intelligent suggestions for improving loan applications

## Dataset Features

The model uses the following features from the Philippine loan dataset:

- **Personal Information**: Gender, Marital Status, Number of Dependents, Education Level
- **Employment**: Self-employment status
- **Financial**: Applicant income, Co-applicant income, Loan amount, Total household income
- **Loan Details**: Loan term, Loan category (House Purchase, Home Improvement/Car, Small Business/Motorcycle)
- **Location**: Property area (Metro Manila, Provincial Cities, Rural Provinces)
- **Credit**: Credit history
- **Calculated Features**: Loan-to-income ratio, Income category classification

## Project Structure

```
backend/
├── dataset/
│   └── philippine_loan_data_cleaned.csv    # Training dataset
├── models/                                  # Generated after training
│   ├── loan_approval_model.pkl            # Trained model
│   ├── label_encoders.pkl                 # Categorical encoders
│   └── feature_columns.pkl                # Feature names
├── static/
│   └── index.html                         # Web interface
├── main.py                                # FastAPI application
├── train_model.py                         # Model training script
├── test_api.py                           # API testing script
├── requirements.txt                       # Python dependencies
├── start.bat                             # Windows startup script
└── README.md                             # This file
```

## Quick Start

### Option 1: Using the Startup Script (Windows)
```bash
# Navigate to the backend directory
cd backend

# Run the startup script (installs dependencies, trains model, starts server)
start.bat
```

### Option 2: Manual Setup

1. **Install Dependencies**
```bash
pip install -r requirements.txt
```

2. **Train the Model**
```bash
python train_model.py
```

3. **Start the API Server**
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

## Usage

### Web Interface
Open your browser and go to: `http://localhost:8001/static/index.html`

### API Documentation
Interactive API docs available at: `http://localhost:8001/docs`

### API Endpoints

#### Health Check
```http
GET /health
```

#### Predict Loan Approval
```http
POST /predict
Content-Type: application/json

{
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
```

**Response:**
```json
{
    "loan_approved": true,
    "approval_probability": 0.85,
    "risk_level": "Low Risk",
    "recommendations": [
        "Your application looks good! You have a high chance of approval."
    ]
}
```

#### Model Information
```http
GET /model-info
```

### Testing the API

Run the test script to verify the API is working:
```bash
python test_api.py
```

## Model Performance

The model is trained using a Random Forest Classifier with the following characteristics:

- **Algorithm**: Random Forest with 100 estimators
- **Target Variable**: Synthetic loan approval status based on business logic
- **Features**: 15 engineered features from the original dataset
- **Evaluation**: Cross-validation with stratified sampling

### Business Logic for Synthetic Labels

Since the original dataset doesn't contain loan approval status, the model creates synthetic labels based on:

- **Credit History** (40% weight): Good credit history significantly increases approval chances
- **Loan-to-Income Ratio** (30% weight): Lower ratios indicate better repayment ability
- **Education Level** (10% weight): College graduates have slight advantage
- **Employment Type** (10% weight): Salaried employees preferred over self-employed
- **Income Category** (10% weight): Higher income categories have better approval rates

## Risk Assessment

The system categorizes applications into three risk levels:

- **Low Risk**: Approval probability ≥ 80%
- **Medium Risk**: Approval probability 60-79%
- **High Risk**: Approval probability < 60%

## Valid Input Values

### Gender
- "Lalaki" (Male)
- "Babae" (Female)

### Marital Status
- "Single"
- "Kasal" (Married)

### Dependents
- "0", "1", "2", "3+"

### Education
- "High School/Vocational"
- "College Graduate"

### Self Employed
- "Yes"
- "No"

### Property Area
- "Metro Manila"
- "Provincial Cities"
- "Rural Provinces"

### Loan Category
- "House Purchase"
- "Home Improvement/Car"
- "Small Business/Motorcycle"

### Credit History
- 1.0 (Good)
- 0.0 (Poor)

## Requirements

- Python 3.8+
- FastAPI
- scikit-learn
- pandas
- numpy
- uvicorn

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. The dataset and model are based on synthetic business logic for demonstration.
