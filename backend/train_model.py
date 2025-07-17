import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os

def create_loan_status(row):
    """
    Create synthetic loan approval status based on business logic
    """
    # Base approval probability
    approval_score = 0.5
    
    # Credit history is crucial (40% weight)
    if row['Credit_History'] == 1.0:
        approval_score += 0.4
    else:
        approval_score -= 0.4
    
    # Loan to income ratio (30% weight)
    if row['Loan_to_Income_Ratio'] <= 2.0:
        approval_score += 0.3
    elif row['Loan_to_Income_Ratio'] <= 3.0:
        approval_score += 0.1
    else:
        approval_score -= 0.2
    
    # Education (10% weight)
    if row['Education'] == 'College Graduate':
        approval_score += 0.1
    
    # Self employment (10% weight)
    if row['Self_Employed'] == 'No':
        approval_score += 0.1
    else:
        approval_score -= 0.05
    
    # Income category (10% weight)
    if row['Income_Category'] in ['Upper Middle (Class B)', 'Middle Class (Class C)']:
        approval_score += 0.1
    elif row['Income_Category'] == 'Lower Middle (Class C-)':
        approval_score += 0.05
    
    # Add some randomness to make it more realistic
    random_factor = np.random.normal(0, 0.1)
    approval_score += random_factor
    
    # Return 1 for approved, 0 for rejected
    return 1 if approval_score > 0.5 else 0

def preprocess_data(df):
    """
    Preprocess the data for machine learning
    """
    # Create loan status
    np.random.seed(42)  # For reproducible results
    df['Loan_Status'] = df.apply(create_loan_status, axis=1)
    
    # Handle missing values
    df['Loan_Amount_PHP'].fillna(df['Loan_Amount_PHP'].median(), inplace=True)
    df['Loan_Term_Days'].fillna(df['Loan_Term_Days'].median(), inplace=True)
    df['Credit_History'].fillna(1.0, inplace=True)
    
    # Create label encoders for categorical variables
    categorical_columns = ['Gender', 'Marital_Status', 'Education', 'Self_Employed', 
                          'Property_Area', 'Income_Category', 'Loan_Category']
    
    label_encoders = {}
    for col in categorical_columns:
        le = LabelEncoder()
        df[col + '_encoded'] = le.fit_transform(df[col])
        label_encoders[col] = le
    
    # Handle dependents column (convert 3+ to 3)
    df['Dependents_numeric'] = df['Dependents'].replace('3+', '3').astype(int)
    
    return df, label_encoders

def train_model():
    """
    Train the loan approval prediction model
    """
    # Load the dataset
    df = pd.read_csv('dataset/philippine_loan_data_cleaned.csv')
    print(f"Loaded dataset with {len(df)} records")
    
    # Preprocess the data
    df, label_encoders = preprocess_data(df)
    
    # Select features for training
    feature_columns = [
        'Gender_encoded', 'Marital_Status_encoded', 'Dependents_numeric',
        'Education_encoded', 'Self_Employed_encoded', 'Applicant_Income_PHP',
        'Coapplicant_Income_PHP', 'Loan_Amount_PHP', 'Loan_Term_Days',
        'Credit_History', 'Property_Area_encoded', 'Income_Category_encoded',
        'Loan_Category_encoded', 'Total_Household_Income_PHP', 'Loan_to_Income_Ratio'
    ]
    
    X = df[feature_columns]
    y = df['Loan_Status']
    
    print(f"Training features: {len(feature_columns)} columns")
    print(f"Target distribution: {y.value_counts().to_dict()}")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train the model
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nModel Accuracy: {accuracy:.3f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Feature Importances:")
    print(feature_importance.head(10))
    
    # Save the model and encoders
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/loan_approval_model.pkl')
    joblib.dump(label_encoders, 'models/label_encoders.pkl')
    joblib.dump(feature_columns, 'models/feature_columns.pkl')
    
    print("\nModel and encoders saved successfully!")
    
    return model, label_encoders, feature_columns, accuracy

if __name__ == "__main__":
    model, encoders, features, accuracy = train_model()
