from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
from typing import Optional
import os

# Initialize FastAPI app
app = FastAPI(
    title="Loan Approval Predictor API",
    description="API for predicting loan approval based on Philippine loan data",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Global variables for model and encoders
model = None
label_encoders = None
feature_columns = None

# Load model and encoders on startup
@app.on_event("startup")
async def load_model():
    global model, label_encoders, feature_columns
    try:
        base_dir = os.path.dirname(__file__)
        model_dir = os.path.join(base_dir, "models")
        
        model = joblib.load(os.path.join(model_dir, 'loan_approval_model.pkl'))
        label_encoders = joblib.load(os.path.join(model_dir, 'label_encoders.pkl'))
        feature_columns = joblib.load(os.path.join(model_dir, 'feature_columns.pkl'))
        print("Model and encoders loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Please run train_model.py first to train the model")

# Pydantic models for request/response
class LoanApplicationRequest(BaseModel):
    gender: str  # "Lalaki" or "Babae"
    marital_status: str  # "Kasal" or "Single"
    dependents: str  # "0", "1", "2", or "3+"
    education: str  # "College Graduate" or "High School/Vocational"
    self_employed: str  # "Yes" or "No"
    applicant_income_php: float
    coapplicant_income_php: float = 0.0
    loan_amount_php: float
    loan_term_days: float = 360.0
    credit_history: float = 1.0  # 1.0 for good, 0.0 for bad
    property_area: str  # "Metro Manila", "Provincial Cities", or "Rural Provinces"
    loan_category: str  # "House Purchase", "Home Improvement", "Car", "Motorcycle", "Personal Loan", "Educational Loan", "Medical Loan", "Business Loan"

class LoanApplicationResponse(BaseModel):
    loan_approved: bool
    approval_probability: float
    risk_level: str
    recommendations: list

# Helper function to calculate income category
def calculate_income_category(total_income: float) -> str:
    if total_income >= 1000000:
        return "Upper Middle (Class B)"
    elif total_income >= 500000:
        return "Middle Class (Class C)"
    else:
        return "Lower Middle (Class C-)"

# Helper function to preprocess input data
def preprocess_input(data: LoanApplicationRequest) -> pd.DataFrame:
    if label_encoders is None or feature_columns is None:
        raise HTTPException(status_code=503, detail="Model not properly loaded")
    
    # Calculate derived features
    total_household_income = data.applicant_income_php + data.coapplicant_income_php
    loan_to_income_ratio = data.loan_amount_php / total_household_income if total_household_income > 0 else 0
    income_category = calculate_income_category(total_household_income)
    
    # Create dataframe
    input_data = {
        'Gender': data.gender,
        'Marital_Status': data.marital_status,
        'Dependents': data.dependents,
        'Education': data.education,
        'Self_Employed': data.self_employed,
        'Applicant_Income_PHP': data.applicant_income_php,
        'Coapplicant_Income_PHP': data.coapplicant_income_php,
        'Loan_Amount_PHP': data.loan_amount_php,
        'Loan_Term_Days': data.loan_term_days,
        'Credit_History': data.credit_history,
        'Property_Area': data.property_area,
        'Income_Category': income_category,
        'Loan_Category': data.loan_category,
        'Total_Household_Income_PHP': total_household_income,
        'Loan_to_Income_Ratio': loan_to_income_ratio
    }
    
    df = pd.DataFrame([input_data])
    
    # Encode categorical variables
    categorical_columns = ['Gender', 'Marital_Status', 'Education', 'Self_Employed', 
                          'Property_Area', 'Income_Category', 'Loan_Category']
    
    for col in categorical_columns:
        if label_encoders and col in label_encoders:
            try:
                df[col + '_encoded'] = label_encoders[col].transform(df[col])
            except ValueError:
                # Handle unseen categories by using the most frequent category
                df[col + '_encoded'] = 0
    
    # Handle dependents
    df['Dependents_numeric'] = df['Dependents'].replace('3+', '3').astype(int)
    
    return df[feature_columns]

# Helper function to generate recommendations
def generate_recommendations(data: LoanApplicationRequest, probability: float) -> list:
    recommendations = []
    
    total_income = data.applicant_income_php + data.coapplicant_income_php
    loan_to_income = data.loan_amount_php / total_income if total_income > 0 else 0
    
    if probability < 0.7:
        if data.credit_history == 0.0:
            recommendations.append("Improve your credit history by paying bills on time")
        
        if loan_to_income > 3.0:
            recommendations.append("Consider reducing the loan amount or increasing your income")
        
        if data.coapplicant_income_php == 0 and data.marital_status == "Kasal":
            recommendations.append("Consider adding a co-applicant to strengthen your application")
        
        if data.education == "High School/Vocational":
            recommendations.append("Consider educational upgrades to improve your profile")
        
        if data.self_employed == "Yes":
            recommendations.append("Provide additional documentation to verify stable income")
            
        # Category-specific recommendations
        if data.loan_category == "Educational Loan":
            recommendations.append("Consider government scholarship programs or school payment plans")
        elif data.loan_category == "Medical Loan":
            recommendations.append("Check if your health insurance covers part of the expenses")
        elif data.loan_category == "Business Loan":
            recommendations.append("Prepare a detailed business plan and financial projections")
        elif data.loan_category == "Car":
            recommendations.append("Consider certified pre-owned vehicles for better loan terms")
        elif data.loan_category == "Motorcycle":
            recommendations.append("Look into dealer financing options which may offer competitive rates")
    else:
        # High probability recommendations
        if data.loan_category == "House Purchase":
            recommendations.append("Great! Consider getting pre-approved for faster processing")
        elif data.loan_category == "Business Loan":
            recommendations.append("Excellent! Prepare your business plan and financial projections")
        elif data.loan_category == "Educational Loan":
            recommendations.append("Perfect! Education is a great investment for your future")
        elif data.loan_category == "Home Improvement":
            recommendations.append("Good choice! Home improvements can increase your property value")
    
    if not recommendations:
        recommendations.append("Your application looks good! You have a high chance of approval.")
    
    return recommendations

# API Routes
@app.get("/")
async def root():
    return {"message": "Loan Approval Predictor API", "status": "active"}

@app.get("/health")
async def health_check():
    model_loaded = model is not None
    return {
        "status": "healthy" if model_loaded else "unhealthy",
        "model_loaded": model_loaded
    }

@app.post("/predict", response_model=LoanApplicationResponse)
async def predict_loan_approval(request: LoanApplicationRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please train the model first.")
    
    try:
        # Preprocess input data
        processed_data = preprocess_input(request)
        
        # Make prediction
        prediction = model.predict(processed_data)[0]
        probability = model.predict_proba(processed_data)[0][1]  # Probability of approval
        
        # Determine risk level
        if probability >= 0.8:
            risk_level = "Low Risk"
        elif probability >= 0.6:
            risk_level = "Medium Risk"
        else:
            risk_level = "High Risk"
        
        # Generate recommendations
        recommendations = generate_recommendations(request, probability)
        
        return LoanApplicationResponse(
            loan_approved=bool(prediction),
            approval_probability=float(probability),
            risk_level=risk_level,
            recommendations=recommendations
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    if model is None or feature_columns is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "model_type": "Random Forest Classifier",
        "features_count": len(feature_columns),
        "feature_names": feature_columns
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
