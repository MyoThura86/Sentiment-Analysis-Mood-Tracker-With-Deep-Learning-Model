# MoodTracker - AI-Powered Mental Health Sentiment Analysis Platform

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)](https://python.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0-purple.svg)](https://mui.com/)

MoodTracker is a comprehensive mental health application that combines advanced AI sentiment analysis with interactive journaling and therapeutic coping strategies. The platform uses fine-tuned RoBERTa and LSTM models to provide real-time emotional insights and personalized mental health recommendations.

## 🌟 Key Features

### 📊 **Dual AI Sentiment Analysis**
- **RoBERTa Model**: High-accuracy transformer-based sentiment classification
- **LSTM Model**: Custom MentalBERT-trained neural network for mental health contexts
- **Real-time Analysis**: Instant sentiment feedback on journal entries
- **Confidence Scoring**: Detailed confidence metrics for each prediction

### 🧠 **AI Mental Health Assistant**
- **Interactive Coping Strategies**: 18 evidence-based therapeutic techniques across 6 categories
- **Practice Sessions**: Guided cognitive behavioral therapy (CBT) exercises
- **Journaling Integration**: Write thoughts during practice sessions with AI sentiment analysis
- **Progress Tracking**: Historical data on coping strategy effectiveness

### 📝 **Advanced Journaling System**
- **Sentiment Timeline**: Visualize emotional patterns over time
- **AI Insights**: Automated emotional pattern recognition
- **Entry Analytics**: Detailed statistics on mood trends
- **Export Functionality**: Download journal data for external analysis

### 📈 **Data Analytics & Visualization**
- **CSV File Analysis**: Bulk sentiment analysis for research datasets
- **Interactive Charts**: Real-time data visualization with Recharts
- **Downloadable Reports**: Export analysis results in CSV format
- **Trend Analysis**: Long-term emotional pattern identification

### 🔐 **User Authentication**
- **Secure Registration/Login**: JWT-based authentication system
- **OAuth Integration**: Support for Google and GitHub login
- **Profile Management**: Personalized user experience
- **Data Privacy**: Secure storage of personal mental health data

## 🏗️ Technical Architecture

### Frontend (React + Vite)
```
src/
├── assets/
│   ├── components/
│   │   ├── auth/                    # Authentication components
│   │   ├── common/                  # Reusable UI components
│   │   ├── journal/                 # Journaling system
│   │   ├── layout/                  # Navigation and layout
│   │   ├── mental-health/           # AI Assistant & coping strategies
│   │   ├── profile/                 # User profile management
│   │   └── research/                # CSV analysis tools
│   └── api/                         # API integration layer
├── config/                          # Application configuration
└── MoodTrackerApp.jsx              # Main application component
```

### Backend (Flask + AI Models)
```
api/
├── auth_api.py                      # Main Flask application
├── biobert_lstm_model.py            # LSTM model integration
├── coping_strategies.json           # Therapeutic strategies database
├── journal_entries.json             # User journal storage
└── users.json                       # User authentication data
```

### AI Models
- **RoBERTa**: Fine-tuned transformer model for general sentiment analysis
- **MentalBERT-LSTM**: Specialized model for mental health sentiment classification
- **Model Integration**: Ensemble approach combining both models for enhanced accuracy

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Special_project
```

### 2. Backend Setup
```bash
# Navigate to project root
cd Special_project

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\\Scripts\\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the API server
python start_api_only.py
```

The API will be available at `http://localhost:5001`

### 3. Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Access the Application
1. Open `http://localhost:5173` in your browser
2. Register a new account or login
3. Start journaling and exploring AI insights!

## 📖 Usage Guide

### Getting Started
1. **Register/Login**: Create an account or sign in with existing credentials
2. **Dashboard**: View your sentiment timeline and recent insights
3. **Journal**: Write entries and receive real-time AI sentiment analysis
4. **AI Assistant**: Explore coping strategies and practice therapeutic techniques
5. **CSV Research**: Upload datasets for bulk sentiment analysis

### AI Mental Health Assistant
The AI Assistant provides evidence-based coping strategies across 6 categories:

#### 🎯 **Emotional Regulation**
- Deep Breathing Exercise (3 min)
- 5-4-3-2-1 Grounding Technique (5 min)
- Emotion Labeling (2 min)

#### 🧘 **Mindfulness & Meditation**
- Mindful Observation (10 min)
- Progressive Body Scan (15 min)
- Loving-Kindness Meditation (10 min)

#### 🧠 **Cognitive Behavioral Techniques**
- Thought Record & Challenge (10 min)
- Behavioral Activation (30 min)
- Structured Problem Solving (20 min)

#### 💚 **Self-Care & Wellness**
- Gentle Movement (10 min)
- Self-Compassion Break (5 min)
- Sensory Comfort Kit (15 min)

#### 🤝 **Social Connection & Support**
- Reach Out to Someone (15 min)
- Share Gratitude (10 min)
- Small Act of Kindness (15 min)

#### 🌟 **Positive Psychology**
- Three Good Things (10 min)
- Character Strengths Practice (15 min)
- Best Possible Self (20 min)

### CSV Analysis
Upload CSV files with text data for bulk sentiment analysis:
1. Ensure your CSV has a text column (supported: text, content, message, review, comment, description, sentence)
2. Upload via the CSV Research page
3. Receive detailed sentiment analysis results
4. Download processed data with sentiment scores

## 🛠️ Development

### Project Structure
```
Special_project/
├── api/                             # Backend Flask application
│   ├── auth_api.py                  # Main API endpoints
│   ├── biobert_lstm_model.py        # AI model integration
│   └── *.json                       # Data storage files
├── src/                             # Frontend React application
│   ├── assets/                      # Components and utilities
│   ├── config/                      # Configuration files
│   └── MoodTrackerApp.jsx          # Root component
├── Fine_tuned_RoBERTa/             # RoBERTa model files
├── mentalbert_sentiment_model/      # MentalBERT model files
├── package.json                     # Node.js dependencies
├── requirements.txt                 # Python dependencies
└── vite.config.js                  # Vite configuration
```

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
python start_api_only.py    # Start API server only
python start_ui.py          # Start UI server only
python run_app.py           # Start both servers
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/github` - GitHub OAuth

#### Sentiment Analysis
- `POST /api/predict/roberta` - RoBERTa model prediction
- `POST /api/predict/lstm` - LSTM model prediction
- `POST /api/predict/both` - Both models comparison
- `POST /api/analyze/csv` - CSV file analysis

#### Journal & Data
- `GET/POST /api/journal/entries` - Journal entry management
- `GET /api/journal/analytics` - Journal analytics
- `GET /api/notifications/insights` - AI insights
- `GET /api/recommendations` - Personalized recommendations

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:
```env
# API Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database Configuration
DATABASE_URL=sqlite:///moodtracker.db
```

### Model Configuration
The application uses pre-trained models located in:
- `Fine_tuned_RoBERTa/` - RoBERTa sentiment analysis model
- `mentalbert_sentiment_model/` - MentalBERT model for mental health context
- `mentalbert_lstm_model.keras` - LSTM model file

## 🧪 Testing

### Backend Testing
```bash
# Test API health
curl http://localhost:5001/api/health

# Test sentiment analysis
curl -X POST http://localhost:5001/api/predict/both \
  -H "Content-Type: application/json" \
  -d '{"text": "I am feeling great today!"}'

# Test CSV analysis
curl -X POST -F "file=@test_data.csv" \
  http://localhost:5001/api/analyze/csv
```

### Frontend Testing
The application includes interactive testing through the UI:
1. Navigate to different pages to test routing
2. Submit journal entries to test sentiment analysis
3. Try coping strategies to test practice sessions
4. Upload CSV files to test bulk analysis

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- **Frontend**: ESLint + Prettier configuration
- **Backend**: PEP 8 Python style guide
- **Commits**: Conventional commit format

### Adding New Features
- **New Components**: Follow the existing component structure in `src/assets/components/`
- **API Endpoints**: Add to `api/auth_api.py` with proper error handling
- **Coping Strategies**: Update `api/coping_strategies.json` with evidence-based techniques

## 📦 Dependencies

### Frontend Dependencies
- **React 18** - UI framework
- **Material-UI 5** - Component library
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Vite** - Build tool
- **Axios** - HTTP client

### Backend Dependencies
- **Flask 3.0** - Web framework
- **Transformers** - HuggingFace models
- **TensorFlow** - LSTM model
- **Flask-CORS** - Cross-origin support
- **NumPy/Pandas** - Data processing

## 🚨 Troubleshooting

### Common Issues

#### Frontend Won't Start
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Backend API Errors
```bash
# Check Python environment
python --version
pip list

# Restart API server
python start_api_only.py
```

#### Model Loading Issues
- Ensure model files are in correct directories
- Check file permissions
- Verify Python dependencies are installed

#### CORS Issues
- API server includes CORS headers
- Ensure frontend is running on `localhost:5173`
- Check browser console for specific errors

### Support
For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and reproduction steps

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **HuggingFace** - For transformer model infrastructure
- **Material-UI** - For the component library
- **React Team** - For the React framework
- **TensorFlow** - For LSTM model support
- **Mental Health Research Community** - For evidence-based therapeutic strategies

## 📊 Project Stats

- **Languages**: JavaScript (Frontend), Python (Backend)
- **Models**: RoBERTa + Custom LSTM
- **Components**: 25+ React components
- **API Endpoints**: 15+ REST endpoints
- **Features**: Authentication, AI Analysis, Journaling, Data Export
- **Development Time**: Extensive research and implementation

---

**🧠 Built with Mental Health in Mind**

MoodTracker combines cutting-edge AI technology with evidence-based therapeutic approaches to support mental wellness through intelligent journaling and personalized insights.
