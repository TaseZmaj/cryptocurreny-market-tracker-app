# Use Python 3.11 slim for a small but stable footprint
FROM python:3.11-slim

# Set environment variables to prevent Python from writing .pyc files
# and to ensure logs are sent straight to the terminal
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies needed for some math libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies first for better Docker caching
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port your service will run on
EXPOSE 8001

# Run Uvicorn.
# Note: Since your file is named app.py, we use "app:app"
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]