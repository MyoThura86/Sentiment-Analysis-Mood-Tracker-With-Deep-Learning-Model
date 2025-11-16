# 🚀 Quick Start Guide

Since npm is not in your PATH, here's the simplest way to run your application:

## Method 1: Manual Start (Recommended)

### Step 1: Install Node.js Dependencies
```bash
# If you have Node.js installed but npm is not in PATH
# Find your Node.js installation and run:
# For example: C:\Program Files\nodejs\npm.exe install
npm install
```

### Step 2: Start API Server
```bash
python start_api_only.py
```

### Step 3: Start Frontend (in a new terminal)
```bash
npm run dev
```

## Method 2: API Only (For Testing)

If you just want to test the API:

```bash
python start_api_only.py
```

Then visit: http://localhost:5001/api/health

## Method 3: Manual Python API Start

```bash
cd api
python app.py
```

## Installing Missing Dependencies

### Python Dependencies
```bash
pip install flask flask-cors
# For the models, you might need:
# pip install torch transformers tensorflow
```

### Node.js Dependencies
```bash
# Find where Node.js is installed and use full path:
# "C:\Program Files\nodejs\npm.exe" install
```

## Testing the API

Once the API is running, test it:

```bash
# Health check
curl http://localhost:5001/api/health

# Test RoBERTa model
curl -X POST http://localhost:5001/api/predict/roberta \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this movie!"}'

# Test both models
curl -X POST http://localhost:5001/api/predict/both \
  -H "Content-Type: application/json" \
  -d '{"text": "This is amazing!"}'
```

## Troubleshooting

1. **npm not found**: Install Node.js from https://nodejs.org/
2. **Python packages missing**: Run `pip install flask flask-cors`
3. **Model loading errors**: Ensure model files are in correct directories
4. **Port conflicts**: Make sure ports 5000 and 5173 are available

## Next Steps

Once both servers are running:
- Frontend: http://localhost:5173
- API: http://localhost:5001
- Try the "Compare Both Models" feature!