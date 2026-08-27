# Use a slim Python image to keep it small
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy only requirements first (for better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your code
COPY . .

# Command to run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]

# Expose the FastAPI port
EXPOSE 8081