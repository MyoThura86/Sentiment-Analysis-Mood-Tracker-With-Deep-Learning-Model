# Complete Translation List - All Remaining Text

## Components Still Needing Translation Integration

### ✅ ALREADY TRANSLATED (Reference Only)
1. **NavigationBar** ✅
2. **DashboardNew** ✅
3. **AIAssistant** ✅
4. **CSVAnalysis** ✅
5. **TestsPage** ✅
6. **MentalHealthInsights** ✅

---

## 🔴 PRIORITY 1: Core User Flow Components

### 1. **JournalEntry.jsx** (Create/Edit Entry)
**Location:** `src/assets/components/journal/JournalEntry.jsx`

**Text to translate:**
- "New Journal Entry" / "Edit Entry"
- "How are you feeling today?"
- "Write your thoughts..."
- "Select your mood"
- Mood labels: "Very Happy", "Happy", "Neutral", "Sad", "Very Sad"
- "Add tags (optional)"
- Tag options: "Work", "Family", "Health", "Relationships", "Finance", "Social"
- "Save Entry"
- "Cancel"
- "Saving..."
- "Entry saved successfully"

---

### 2. **AllEntriesNew.jsx** (Journal List)
**Location:** `src/assets/components/journal/AllEntriesNew.jsx`

**Text to translate:**
- "All Journal Entries"
- "Filter by mood"
- "Filter by date"
- "Search entries..."
- "Sort by: Newest First"
- "Sort by: Oldest First"
- "Sort by: Mood"
- "Edit"
- "Delete"
- "words" (e.g., "150 words")
- "characters"
- "Read More"
- "Show Less"
- "No entries found"
- "Start writing to see your entries here"

---

### 3. **TakeTest.jsx** (Test Taking Interface)
**Location:** `src/assets/components/mental-health/TakeTest.jsx`

**CRITICAL - Has ALL test questions!**

**Text to translate:**

#### Navigation & Progress:
- "Question X of Y"
- "Progress: X%"
- "Next"
- "Previous"
- "Submit Test"
- "Submitting..."
- "Please answer all questions"

#### PHQ-9 Questions (Depression):
- "Over the last 2 weeks, how often have you been bothered by:"
- "Little interest or pleasure in doing things"
- "Feeling down, depressed, or hopeless"
- "Trouble falling or staying asleep, or sleeping too much"
- "Feeling tired or having little energy"
- "Poor appetite or overeating"
- "Feeling bad about yourself"
- "Trouble concentrating on things"
- "Moving or speaking slowly/being fidgety"
- "Thoughts that you would be better off dead"

#### GAD-7 Questions (Anxiety):
- "Over the last 2 weeks, how often have you been bothered by:"
- "Feeling nervous, anxious, or on edge"
- "Not being able to stop or control worrying"
- "Worrying too much about different things"
- "Trouble relaxing"
- "Being so restless that it's hard to sit still"
- "Becoming easily annoyed or irritable"
- "Feeling afraid as if something awful might happen"

#### PSS-10 Questions (Stress):
- "In the last month, how often have you:"
- "Been upset because of something unexpected"
- "Felt unable to control important things"
- "Felt nervous and stressed"
- "Felt confident about handling personal problems" (reverse)
- "Felt things were going your way" (reverse)
- "Found you could not cope with all things"
- "Been able to control irritations" (reverse)
- "Felt on top of things" (reverse)
- "Been angered by things outside your control"
- "Felt difficulties were piling up"

#### Big Five Personality Questions:
- "I am the life of the party" (Extraversion)
- "I feel little concern for others" (Agreeableness -)
- "I am always prepared" (Conscientiousness)
- "I get stressed out easily" (Neuroticism)
- "I have a rich vocabulary" (Openness)
- "I don't talk a lot" (Extraversion -)
- "I am interested in people" (Agreeableness)
- "I leave my belongings around" (Conscientiousness -)
- "I am relaxed most of the time" (Neuroticism -)
- "I have difficulty understanding abstract ideas" (Openness -)

#### Response Options:
**PHQ-9 & GAD-7:**
- "Not at all"
- "Several days"
- "More than half the days"
- "Nearly every day"

**PSS-10:**
- "Never"
- "Almost Never"
- "Sometimes"
- "Fairly Often"
- "Very Often"

**Big Five:**
- "Strongly Disagree"
- "Disagree"
- "Neutral"
- "Agree"
- "Strongly Agree"

---

### 4. **TestResults.jsx** (Test Results Display)
**Location:** `src/assets/components/mental-health/TestResults.jsx`

**Text to translate:**
- "Test Results"
- "Your Score"
- "X out of Y points"
- "Severity Level:"
- "Interpretation"
- "What this means:"
- "Recommendations"

#### Severity Levels - PHQ-9:
- "Minimal depression" (0-4)
- "Mild depression" (5-9)
- "Moderate depression" (10-14)
- "Moderately severe depression" (15-19)
- "Severe depression" (20-27)

#### Severity Levels - GAD-7:
- "Minimal anxiety" (0-4)
- "Mild anxiety" (5-9)
- "Moderate anxiety" (10-14)
- "Severe anxiety" (15-21)

#### Severity Levels - PSS-10:
- "Low stress" (0-13)
- "Moderate stress" (14-26)
- "High stress" (27-40)

#### Big Five Results:
- "Extraversion" / "High/Average/Low"
- "Agreeableness" / "High/Average/Low"
- "Conscientiousness" / "High/Average/Low"
- "Neuroticism" / "High/Average/Low"
- "Openness" / "High/Average/Low"

#### Crisis Warning:
- "⚠️ Crisis Indicators Detected"
- "Your responses indicate you may be experiencing thoughts of self-harm. Please reach out for help immediately."
- "Crisis Resources"
- "If you're in crisis:"
- "988 Suicide & Crisis Lifeline: Call or text 988"
- "Crisis Text Line: Text HOME to 741741"
- "Emergency: Call 911"

#### Action Buttons:
- "Next Steps"
- "Retake Test"
- "View History"
- "View Detailed Report"
- "Download Results (PDF)"
- "Share with Healthcare Provider"
- "Back to Tests"
- "Go to Dashboard"

---

### 5. **TestHistory.jsx** (Historical Test Data)
**Location:** `src/assets/components/mental-health/TestHistory.jsx`

**Text to translate:**
- "Test History"
- "Your Progress Over Time"
- "Filter by test type:"
- "All Tests"
- "Filter by date range:"
- "Last 7 days"
- "Last 30 days"
- "Last 90 days"
- "All time"
- "Export Data"
- "Print Report"

#### Chart Labels:
- "Score Trend"
- "Test Date"
- "Score"
- "Trend Line"
- "Average Score Line"

#### Summary Stats:
- "Total Tests Taken:"
- "Average Score:"
- "Lowest Score:"
- "Highest Score:"
- "Most Recent:"
- "Trend:"
- "Improving"
- "Stable"
- "Worsening"

#### Individual Results:
- "Taken on"
- "Severity:"
- "View Details"
- "Compare with Previous"

---

## 🟡 PRIORITY 2: User Management

### 6. **ProfileSettings.jsx** (User Profile)
**Location:** `src/assets/components/profile/ProfileSettings.jsx`

**Text to translate:**
- "My Profile"
- "Account Settings"
- "Personal Information"
- "First Name"
- "Last Name"
- "Email Address"
- "Date of Birth"
- "Gender"
- "Male" / "Female" / "Other" / "Prefer not to say"
- "Update Profile"
- "Save Changes"

#### Notification Settings:
- "Notification Settings"
- "Email Notifications"
- "Daily Mood Reminders"
- "Weekly Summary Reports"
- "New Insights Available"

#### Privacy Settings:
- "Privacy Settings"
- "Data & Privacy"
- "Download My Data"
- "Delete My Account"
- "Export Journal Entries"

#### Language & Theme:
- "Language Preference"
- "Display Language"
- "English" / "Myanmar (မြန်မာ)"
- "Appearance"
- "Light Mode"
- "Dark Mode"
- "Auto (System)"

---

### 7. **SignInNew.jsx** / **SignUpNew.jsx** (Authentication)
**Location:** `src/assets/components/auth/`

#### Sign In:
- "Sign In"
- "Welcome Back"
- "Sign in to continue to MoodTracker"
- "Email"
- "Password"
- "Remember me"
- "Forgot password?"
- "Don't have an account?"
- "Sign Up"
- "Or continue with"
- "Sign in with Google"
- "Sign in with Facebook"

#### Sign Up:
- "Create Account"
- "Join MoodTracker"
- "Start your mental wellness journey"
- "Confirm Password"
- "I agree to the"
- "Terms of Service"
- "and"
- "Privacy Policy"
- "Already have an account?"

#### Password Reset:
- "Reset Password"
- "Enter your email to reset password"
- "Send Reset Link"
- "Back to Sign In"
- "Check your email"
- "Password reset link has been sent to your email"

---

## 🟢 PRIORITY 3: Supporting Components

### 8. **NotificationSystem.jsx**
**Location:** `src/assets/components/NotificationSystem.jsx`

**Text to translate:**
- "Notifications"
- "New Insight Available"
- "You have a new personalized insight..."
- "Time to Check In"
- "How are you feeling today? Take a moment to journal"
- "Weekly Summary Ready"
- "Your weekly mental wellness summary is ready"
- "Reminder: Complete Test"
- "It's time to retake your mental health assessment"
- "Coping Strategy Suggestion"
- "Based on your mood, we suggest trying..."
- "View"
- "Dismiss"
- "Snooze"
- "Mark all as read"
- "Clear all"
- "No new notifications"

---

### 9. **ModelSelector.jsx**
**Location:** `src/assets/components/ModelSelector.jsx`

**Text to translate:**
- "Select Analysis Model"
- "RoBERTa Model"
- "Advanced transformer-based sentiment analysis"
- "LSTM Model"
- "Deep learning sequence analysis"
- "Both Models (Comparison)"
- "Compare results from both models"

---

## 🔵 PRIORITY 4: Error Messages & Validation

### Global Error/Success Messages:
**Already in translations but need integration:**

#### Common States:
- "Error"
- "Success"
- "Warning"
- "Information"

#### Specific Errors:
- "Failed to load data"
- "Network error. Please check your connection"
- "Session expired. Please sign in again"
- "Invalid email or password"
- "This field is required"
- "Please enter a valid email address"
- "Password must be at least 8 characters"
- "Passwords do not match"
- "Failed to save entry. Please try again"
- "Failed to submit test. Please try again"

#### Success Messages:
- "Entry saved successfully"
- "Test submitted successfully"
- "Profile updated successfully"
- "Settings saved"
- "Data exported successfully"

---

## 📋 Empty States

**Already in translations but need integration:**

- "No data available"
- "Get started by creating your first journal entry"
- "No results found"
- "Try adjusting your filters"
- "No tests taken yet"
- "Take your first mental health assessment"
- "No history available"
- "Complete some tests to see your progress"
- "Nothing here yet"
- "Start exploring to see content here"

---

## 💡 Tooltips & Help Text

**Already in translations but need integration:**

- "What is this?"
- "Learn more"
- "Help"
- "Info"
- "Your overall mental wellbeing score based on recent assessments"
- "Track your mood changes over time"
- "Evidence-based coping strategies personalized for you"
- "AI-generated insights from your journal entries"
- "Lower scores indicate fewer symptoms (better outcomes)"
- "This is a screening tool, not a diagnosis"
- "Consecutive days you've journaled"

---

## 🔖 Footer

**Already in translations but need integration:**

- "About Us"
- "Contact"
- "Privacy Policy"
- "Terms of Service"
- "Help Center"
- "FAQ"
- "Blog"
- "Resources"
- "© 2024 MoodTracker. All rights reserved."
- "Made with ❤️ for mental wellness"
- "Your mental health matters"

---

## 📊 SUMMARY

### Translation Status:
- ✅ **DONE:** Navigation, Dashboard, AI Assistant, CSV Research, Tests Page (list), Mental Health Insights
- 🔴 **CRITICAL:** JournalEntry, AllEntries, TakeTest (has all questions!), TestResults, TestHistory
- 🟡 **HIGH:** ProfileSettings, Authentication (SignIn/SignUp)
- 🟢 **MEDIUM:** NotificationSystem, ModelSelector
- 🔵 **LOW:** Error messages, Empty states, Tooltips, Footer (already in translation files)

### Total Components Needing Integration: **9 major components**

### Estimated Translation Keys: **~200 additional keys**

---

## 🎯 RECOMMENDATION

**Start with these in order:**

1. **TakeTest.jsx** - Most critical (has all test questions!)
2. **TestResults.jsx** - Shows after test
3. **JournalEntry.jsx** - Core functionality
4. **AllEntriesNew.jsx** - View entries
5. **TestHistory.jsx** - Historical data
6. **ProfileSettings.jsx** - User management
7. **SignInNew/SignUpNew** - First user experience
8. **NotificationSystem** - Engagement
9. **ModelSelector** - Supporting feature

Would you like me to:
1. Start integrating these one by one?
2. Create translation keys for all of them first?
3. Give you the translation files to fill in Myanmar text yourself?
