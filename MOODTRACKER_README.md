# 🧠 MoodTracker - Mental Health Journal & Sentiment Analysis

A beautiful, AI-powered mental health journal that tracks your emotional wellness journey with sentiment analysis and insightful visualizations.

## ✨ Features

### 🔐 **Authentication System**
- **Beautiful Sign In/Sign Up Pages**: Gradient backgrounds with floating animations
- **Multi-step Registration**: Guided onboarding with privacy agreements
- **Secure Local Storage**: User sessions and data persistence
- **Social Login Ready**: Google and GitHub integration placeholders

### 📝 **Journal Interface**
- **Rich Text Entry**: Beautiful, responsive journal writing interface
- **Real-time Sentiment Analysis**: Dual AI model analysis (RoBERTa + LSTM)
- **Confidence Scoring**: Detailed accuracy metrics for each analysis
- **Motivational Feedback**: Personalized messages based on sentiment

### 📊 **Advanced Dashboard**
- **Mood Trend Charts**: 7-day mood tracking with area charts
- **Sentiment Distribution**: Pie charts showing emotional patterns
- **Streak Tracking**: Gamified daily journal entry streaks
- **Personal Stats**: Total entries, recent trends, and wellness indicators

### 🤖 **AI-Powered Analysis**
- **Dual Model Comparison**: RoBERTa transformer vs LSTM models
- **Detailed Scoring**: Positive, neutral, negative confidence percentages
- **Model Agreement Indicators**: Shows when both AI models agree
- **Historical Pattern Recognition**: Track emotional trends over time

### 🎨 **Beautiful Design**
- **Modern Material-UI**: Clean, professional interface
- **Gradient Animations**: Smooth floating elements and transitions
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Dark/Light Theme Ready**: Built with theme customization in mind

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- Python 3.7+ with required packages
- Your trained sentiment analysis models

### Quick Start

1. **Start the API Server:**
   ```bash
   cd Special_project/api
   python simple_app.py  # For testing with mock data
   # or
   python app.py         # For real model analysis
   ```

2. **Start the Frontend:**
   ```bash
   cd Special_project
   npm install
   npm run dev
   ```

3. **Visit the App:**
   - Open http://localhost:5174
   - Create an account or sign in
   - Start journaling!

## 🏗️ Architecture

```
MoodTracker/
├── 🎨 Frontend (React + Material-UI)
│   ├── Landing Page - Marketing site with features
│   ├── Authentication - Sign in/up with validation
│   ├── Dashboard - Main app with charts and stats
│   └── Journal Entry - Writing and analysis interface
├── 🤖 Backend (Flask API)
│   ├── Sentiment Analysis - Dual model processing
│   ├── CORS Enabled - Frontend communication
│   └── JSON Responses - Structured data format
└── 💾 Data Persistence
    ├── LocalStorage - User sessions and preferences
    ├── Journal Entries - User writing with analysis
    └── Analytics - Mood trends and statistics
```

## 🎯 User Journey

### 1. **Onboarding**
- Lands on beautiful marketing page
- Signs up with guided 3-step process
- Sees privacy and security commitments

### 2. **First Journal Entry**
- Guided interface for writing
- Real-time sentiment analysis
- Motivational feedback and insights

### 3. **Building Habits**
- Daily entry reminders
- Streak tracking gamification
- Progress visualization

### 4. **Long-term Insights**
- Historical mood trends
- Pattern recognition
- Wellness recommendations

## 📱 Screenshots

### Landing Page
- Hero section with animated gradients
- Feature showcase with icons
- User testimonials
- Call-to-action buttons

### Sign Up Process
- Step 1: Personal information
- Step 2: Account security
- Step 3: Privacy agreements
- Social login options

### Dashboard
- Welcome message with user name
- Statistics cards (entries, streak, trend)
- Mood trend chart (7 days)
- Sentiment distribution pie chart
- Recent journal entries preview

### Journal Entry
- Clean writing interface
- AI analysis results
- Confidence scores
- Model comparison
- Motivational messages

## 🛠️ Technical Features

### Frontend Technologies
- **React 19** - Latest version with concurrent features
- **Material-UI v5** - Modern design system
- **Recharts** - Beautiful, responsive charts
- **React Router** - Client-side routing
- **Vite** - Fast development and building

### Backend Technologies
- **Flask** - Lightweight Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Mock API** - Testing without ML dependencies
- **Sentiment Models** - RoBERTa + LSTM integration ready

### Data Features
- **LocalStorage Persistence** - Offline-first approach
- **JSON Data Format** - Structured and extensible
- **User Session Management** - Secure authentication state
- **Chart Data Generation** - Real-time analytics

## 🔮 Future Enhancements

### Near-term
- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] User profile and settings pages
- [ ] Export journal entries (PDF, CSV)
- [ ] Email reminders and notifications
- [ ] Mobile app (React Native)

### Long-term
- [ ] Advanced analytics and insights
- [ ] Mental health professional integration
- [ ] Community features (optional sharing)
- [ ] Integration with fitness/sleep trackers
- [ ] Personalized recommendations
- [ ] Multi-language support

## 🧪 Testing Data

The app includes sample data for demonstration:
- 6 sample journal entries with varied sentiments
- Realistic confidence scores and trends
- Mock user statistics and streaks
- Chart visualizations with pattern data

## 🔒 Privacy & Security

- **Local Data Storage** - Your entries stay on your device
- **Encrypted Analysis** - Sentiment processing is secure
- **No Data Mining** - We don't sell or share your data
- **GDPR Compliant** - Privacy by design principles
- **Optional Cloud Sync** - User-controlled data backup

## 💡 Use Cases

### Personal Wellness
- Daily mood tracking and reflection
- Emotional pattern recognition
- Mental health goal setting
- Stress and anxiety monitoring

### Clinical Applications
- Therapy session preparation
- Progress tracking between appointments
- Medication effectiveness monitoring
- Trigger identification and management

### Research Applications
- Longitudinal mood studies
- Sentiment analysis accuracy research
- Mental health intervention effectiveness
- Population-level wellness insights

## 🎨 Design Philosophy

### User-Centered
- Intuitive, beautiful interface
- Minimal cognitive load
- Accessibility-first design
- Mobile-responsive layout

### Privacy-First
- Local data storage
- Transparent data usage
- User control over information
- Secure by default

### Evidence-Based
- Clinically-informed features
- Validated assessment tools
- Research-backed interventions
- Measurable outcomes

---

## 🌟 Get Started Today

Transform your mental wellness journey with AI-powered insights and beautiful visualizations. Your emotional health matters, and MoodTracker is here to support you every step of the way.

**Start journaling at http://localhost:5174** 🚀

*"Your mental health is a priority. Your happiness is essential. Your self-care is a necessity."*