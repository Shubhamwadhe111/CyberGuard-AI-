FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy dependency files
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files
COPY . .

# Set environment variables
ENV PORT=7860

# Expose port
EXPOSE 7860

# Run the flask application
CMD ["python", "app.py"]
