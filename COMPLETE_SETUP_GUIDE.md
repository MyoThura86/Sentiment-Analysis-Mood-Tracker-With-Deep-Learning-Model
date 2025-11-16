# Complete Setup & Testing Guide

## What Was Fixed

### 1. JWT Authentication System
**Problem:** Frontend was receiving JWT tokens but not storing or using them
**Solution:** Updated all authentication components to:
- Store JWT token in localStorage upon login/signup
- Send `Authorization: Bearer <token>` header with all API requests
- Maintain backward compatibility with fallback headers

**Files Modified:**
- `src/assets/components/auth/SignInNew.jsx` - Lines 88, 159
- `src/assets/components/auth/SignUpNew.jsx` - Lines 150, 218
- `src/assets/components/auth/OAuthCallback.jsx` - Line 82
- `src/assets/api/journalApi.js` - Lines 23-39
- `src/assets/api/userApi.js` - Lines 23-40
- `src/assets/api/testsApi.js` - Lines 26-43

### 2. Database Setup
**Problem:** Missing psychological test tables in database
**Solution:** Created comprehensive database initialization system

**What's Now Available:**
- 4 Psychological Tests:
  - PHQ-9 Depression Screening (9 questions)
  - GAD-7 Anxiety Screening (7 questions)
  - Big Five Personality Test (50 questions)
  - Perceived Stress Scale PSS-10 (10 questions)

**Database Tables Created:**
- `users` - User accounts
- `journal_entries` - Mood journal entries
- `psychological_tests` - Test definitions
- `test_questions` - All test questions
- `test_response_options` - Answer choices
- `user_test_results` - User test results
- `test_score_thresholds` - Scoring interpretations

**New Files Created:**
- `api/init_database.py` - Database initialization script

## How to Start the Application

### Step 1: Clear Browser Storage
1. Open DevTools (F12)
2. Go to **Application** → **Local Storage** → `http://localhost:5173`
3. Click "Clear All"
4. Refresh the page

### Step 2: Start Backend API
```bash
cd api
python start_api.py
```

**Expected Output:**
```
============================================================
MOODTRACKER API v2.0 - Loading Models...
============================================================
[OK] Fine-tuned RoBERTa: LOADED
[OK] MentalBERT-LSTM: LOADED
============================================================
[URL]  http://localhost:5001
[DOCS] http://localhost:5001/api/docs
[TEST] http://localhost:5001/api/health
============================================================
```

### Step 3: Start Frontend (New Terminal)
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Testing the Application

### 1. Authentication Flow
1. **Sign Up** → Navigate to `/signup`
   - Enter email, password, first/last name
   - Submit form
   - **Expected:** Token stored in localStorage, redirected to dashboard

2. **Sign In** → Navigate to `/signin`
   - Enter credentials
   - **Expected:** Token stored, no 401 errors in console

3. **Verify Token Storage**
   - Open DevTools → Application → Local Storage
   - **Expected:** See `token` key with JWT value

### 2. Journal Entries
1. Navigate to Dashboard
2. Create a new journal entry
3. **Expected:**
   - Entry saved successfully
   - No 401 errors
   - Sentiment analysis results displayed
   - AI insights generated

### 3. Psychological Tests
1. Navigate to Tests page (`/tests`)
2. **Expected:** See 4 tests listed:
   - PHQ-9 Depression Screening
   - GAD-7 Anxiety Screening
   - Big Five Personality Test
   - PSS-10 Stress Scale

3. Take a test:
   - Click "Take Test"
   - Answer all questions
   - Submit
   - **Expected:** Results with severity level and recommendations

### 4. Mental Health Insights
1. Take at least 1-2 tests
2. Create some journal entries
3. Navigate to Mental Health Insights
4. **Expected:**
   - Test results summary
   - Personalized coping strategies based on test results
   - Trend analysis if multiple tests taken

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/github` - GitHub OAuth

### Journal (Requires JWT)
- `GET /api/journal/entries` - Get all entries
- `POST /api/journal/entries` - Create entry
- `DELETE /api/journal/entries/{id}` - Delete entry
- `GET /api/journal/analytics` - Get analytics

### Psychological Tests
- `GET /api/tests` - List all tests
- `GET /api/tests/{id}` - Get test with questions
- `POST /api/tests/{id}/submit` - Submit answers (Requires JWT)
- `GET /api/users/{user_id}/test-results` - Get test history
- `GET /api/users/{user_id}/mental-health-insights` - Get insights

### Sentiment Analysis
- `POST /api/predict/roberta` - RoBERTa model
- `POST /api/predict/lstm` - MentalBERT-LSTM model
- `POST /api/predict/both` - Both models
- `POST /api/analyze/csv` - Batch CSV analysis

## Common Issues & Solutions

### Issue: 401 Unauthorized Errors
**Solution:**
1. Clear localStorage
2. Sign out and sign in again
3. Check that token is being stored: DevTools → Application → Local Storage

### Issue: Tests Not Loading
**Solution:**
1. Run database initialization:
   ```bash
   cd api
   python init_database.py
   ```
2. Restart backend server

### Issue: Google OAuth Error
**Solution:**
1. Add authorized origins in Google Cloud Console:
   - `http://localhost:5173`
   - `http://localhost:5001`
2. Add redirect URI:
   - `http://localhost:5173/auth/google/callback`

### Issue: Models Not Loading
**Solution:**
- Check that model files exist in:
  - `Fine_tuned_RoBERTa/roberta_sentiment_model/`
  - `Fine_tuned_RoBERTa/roberta_tokenizer/`
  - `mentalbert_lstm_model.keras`

## Database Location
- Database file: `api/mood_tracking.db`
- The API runs from the `api` folder, so the database is created there
- Do NOT delete this file or you'll lose all data

## Checking System Health

### Backend Health Check
```bash
curl http://localhost:5001/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "services": {
    "ml_models": {
      "roberta": {"loaded": true, "status": "ready"},
      "lstm": {"loaded": true, "status": "ready"}
    },
    "database": {"status": "connected"},
    "redis": {"status": "disconnected"},
    "cache": {"type": "simple", "configured": true}
  }
}
```

### Check Database
```bash
cd api
python -c "import sqlite3; conn = sqlite3.connect('mood_tracking.db'); cursor = conn.cursor(); cursor.execute('SELECT id, test_name FROM psychological_tests'); print('\n'.join([f'{r[0]}: {r[1]}' for r in cursor.fetchall()]))"
```

**Expected Output:**
```
1: PHQ-9 Depression Screening
2: GAD-7 Anxiety Screening
3: Big Five Personality Test
4: Perceived Stress Scale (PSS-10)
```

## Features Now Working

✅ JWT Authentication (login/signup/OAuth)
✅ Journal Entries (create, read, delete)
✅ Sentiment Analysis (dual models)
✅ Psychological Tests (all 4 tests)
✅ Test Results & History
✅ Mental Health Insights
✅ Personalized Coping Strategies
✅ Analytics & Trends
✅ User Profiles
✅ Dashboard Statistics

## Next Steps

1. **Test thoroughly** - Try all features to ensure they work
2. **Report issues** - If you find bugs, note the exact steps to reproduce
3. **Check console** - Watch for any errors in browser console or API logs
4. **Verify data persistence** - Make sure data saves correctly across sessions

## API Documentation

Full API documentation available at:
- **Swagger UI:** http://localhost:5001/api/docs
- **Health Check:** http://localhost:5001/api/health

## Support

If you encounter issues:
1. Check the console logs (frontend and backend)
2. Verify database is properly initialized
3. Ensure JWT token is being sent with requests
4. Check that all environment variables are set correctly
