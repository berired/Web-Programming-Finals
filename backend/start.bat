@echo off
echo Starting Loan Approval Predictor Backend...

echo.
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Training the machine learning model...
python train_model.py

echo.
echo Starting the FastAPI server...
echo Open http://localhost:8001/static/index.html in your browser to test the application
echo API documentation available at http://localhost:8001/docs
echo.
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
