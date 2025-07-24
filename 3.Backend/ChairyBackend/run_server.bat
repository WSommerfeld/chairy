@echo off
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Starting FastAPI server on port 8001...
uvicorn main:app --reload --port 8001

pause
