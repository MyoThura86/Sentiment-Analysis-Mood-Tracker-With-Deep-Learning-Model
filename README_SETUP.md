# Dual Model Sentiment Analysis Application

This application allows you to analyze sentiment using two different machine learning models:
- **RoBERTa** (Fine-tuned transformer model)
- **LSTM** (MentalBERT-based LSTM model)

## Features

- 🔍 **Dual Model Analysis**: Compare predictions from both models side-by-side
- 📊 **Interactive Charts**: Visualize confidence scores and model comparisons
- 🎨 **Modern UI**: Beautiful Material-UI interface with responsive design
- 📈 **Detailed Results**: View confidence scores and probability distributions
- 🚀 **Real-time Analysis**: Instant sentiment prediction with live results

## Quick Start

### 1. Start the API Server

```bash
python start_api.py
```

This will:
- Check for required Python packages
- Verify model files are present
- Start the Flask API server at `http://localhost:5001`

### 2. Start the Frontend

```bash
# On Windows
start_frontend.bat

# On macOS/Linux
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Manual Setup

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd api
   pip install -r requirements.txt
   ```

2. **Ensure model files are present:**
   - `Fine_tuned_RoBERTa/roberta_sentiment_model/` - RoBERTa model directory
   - `Fine_tuned_RoBERTa/roberta_tokenizer/` - RoBERTa tokenizer directory
   - `mentalbert_lstm_model_full.keras` - LSTM model file

3. **Start the API server:**
   ```bash
   cd api
   python app.py
   ```

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

## Usage

### Single Text Analysis
1. Navigate to the home page
2. Click "Compare Both Models"
3. Enter your text in the text area
4. Click "Analyze Sentiment"
5. View results from both models with confidence scores

### Batch Analysis
- Use "Import CSV" to analyze multiple texts from a CSV file
- Use "Import Text" to analyze longer text documents

## API Endpoints

- `GET /api/health` - Check server status and model availability
- `POST /api/predict/roberta` - Analyze sentiment using RoBERTa model
- `POST /api/predict/lstm` - Analyze sentiment using LSTM model
- `POST /api/predict/both` - Analyze sentiment using both models

### Example API Request

```javascript
// Analyze with both models
fetch('http://localhost:5001/api/predict/both', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: "This movie is absolutely amazing!"
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Project Structure

```
Special_project/
├── api/                          # Flask API server
│   ├── app.py                   # Main API application
│   └── requirements.txt         # Python dependencies
├── src/                         # React frontend
│   ├── assets/components/       # React components
│   │   ├── dualModelAnalysis.jsx
│   │   ├── enhancedSentimentCard.jsx
│   │   └── ...
│   └── App.jsx                  # Main React app
├── Fine_tuned_RoBERTa/         # RoBERTa model files
├── mentalbert_based_lstm_model/ # LSTM model files
├── start_api.py                # API startup script
├── start_frontend.bat          # Frontend startup script (Windows)
└── package.json                # Node.js dependencies
```

## Troubleshooting

### Common Issues

1. **API server won't start:**
   - Check that all Python dependencies are installed
   - Verify model files are in the correct locations
   - Ensure port 5000 is not in use

2. **Frontend won't connect to API:**
   - Ensure API server is running on port 5000
   - Check browser console for CORS errors
   - Verify both servers are running

3. **Model loading errors:**
   - Check that model files are not corrupted
   - Ensure sufficient memory is available
   - Verify PyTorch/TensorFlow installations

### Performance Tips

- The first prediction may be slower as models are loaded into memory
- For better performance, consider using a GPU if available
- LSTM model predictions are currently using mock data - implement proper preprocessing for your specific model

## Development

### Adding New Models

1. Add model loading logic in `api/app.py`
2. Create new prediction endpoint
3. Update frontend components to display new model results
4. Add model selection to the UI

### Customizing the UI

- Modify components in `src/assets/components/`
- Update styling in Material-UI theme
- Add new routes in `src/App.jsx`

## License

This project is for educational and research purposes.