#!/bin/bash

echo "Activating virtual environment..."
source venv/bin/activate

echo "Starting FastAPI server on port 8001..."
uvicorn main:app --reload --port 8001
