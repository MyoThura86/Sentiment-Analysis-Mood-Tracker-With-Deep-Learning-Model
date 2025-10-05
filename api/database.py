import sqlite3
import json
from datetime import datetime, timedelta
import os

class MoodTrackingDB:
    def __init__(self, db_path="mood_tracking.db"):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """Initialize the database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Create users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT UNIQUE NOT NULL,
                email TEXT,
                name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Create journal_entries table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS journal_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                text TEXT NOT NULL,
                sentiment TEXT NOT NULL,
                confidence REAL NOT NULL,
                mood_score REAL NOT NULL,
                scores TEXT, -- JSON string of sentiment scores
                tags TEXT, -- JSON string of tags
                analysis TEXT, -- JSON string of AI analysis
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                date TEXT NOT NULL -- ISO date string for the entry
            )
        ''')

        # Create indexes for better performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_entries ON journal_entries(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_entry_date ON journal_entries(date)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_date ON journal_entries(user_id, date)')

        # Create psychological_tests table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS psychological_tests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_type TEXT NOT NULL UNIQUE,
                test_name TEXT NOT NULL,
                description TEXT,
                total_questions INTEGER NOT NULL,
                max_score INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Create test_questions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS test_questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                question_number INTEGER NOT NULL,
                question_text TEXT NOT NULL,
                FOREIGN KEY (test_id) REFERENCES psychological_tests(id)
            )
        ''')

        # Create test_response_options table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS test_response_options (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                option_text TEXT NOT NULL,
                option_value INTEGER NOT NULL,
                FOREIGN KEY (test_id) REFERENCES psychological_tests(id)
            )
        ''')

        # Create user_test_results table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_test_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                test_id INTEGER NOT NULL,
                total_score INTEGER NOT NULL,
                severity_level TEXT NOT NULL,
                answers TEXT NOT NULL,
                has_crisis_indicators BOOLEAN DEFAULT 0,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (test_id) REFERENCES psychological_tests(id)
            )
        ''')

        # Create test_score_thresholds table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS test_score_thresholds (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                min_score INTEGER NOT NULL,
                max_score INTEGER NOT NULL,
                severity_level TEXT NOT NULL,
                description TEXT,
                recommendations TEXT,
                FOREIGN KEY (test_id) REFERENCES psychological_tests(id)
            )
        ''')

        # Create indexes for tests
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_test_results ON user_test_results(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_test_completed_at ON user_test_results(completed_at)')

        conn.commit()
        conn.close()

    def get_connection(self):
        """Get a database connection"""
        return sqlite3.connect(self.db_path)

    def create_user(self, user_id, email=None, name=None):
        """Create or update a user"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT OR REPLACE INTO users (user_id, email, name, last_login)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ''', (user_id, email, name))

        conn.commit()
        conn.close()

    def create_journal_entry(self, user_id, text, sentiment, confidence, mood_score, scores, tags, analysis):
        """Create a new journal entry"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # Ensure user exists
        self.create_user(user_id)

        entry_date = datetime.now().isoformat()

        cursor.execute('''
            INSERT INTO journal_entries
            (user_id, text, sentiment, confidence, mood_score, scores, tags, analysis, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            text,
            sentiment,
            confidence,
            mood_score,
            json.dumps(scores),
            json.dumps(tags),
            json.dumps(analysis),
            entry_date
        ))

        entry_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return entry_id

    def get_journal_entries(self, user_id, limit=None, offset=0):
        """Get journal entries for a user"""
        conn = self.get_connection()
        cursor = conn.cursor()

        query = '''
            SELECT id, text, sentiment, confidence, mood_score, scores, tags, analysis, date, created_at
            FROM journal_entries
            WHERE user_id = ?
            ORDER BY created_at DESC
        '''

        params = [user_id]

        if limit:
            query += ' LIMIT ? OFFSET ?'
            params.extend([limit, offset])

        cursor.execute(query, params)
        rows = cursor.fetchall()

        entries = []
        for row in rows:
            entry = {
                'id': row[0],
                'user_id': user_id,
                'text': row[1],
                'sentiment': row[2],
                'confidence': row[3],
                'mood_score': row[4],
                'scores': json.loads(row[5]) if row[5] else {},
                'tags': json.loads(row[6]) if row[6] else [],
                'analysis': json.loads(row[7]) if row[7] else {},
                'date': row[8],
                'created_at': row[9]
            }
            entries.append(entry)

        conn.close()
        return entries

    def delete_journal_entry(self, user_id, entry_id):
        """Delete a journal entry"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            DELETE FROM journal_entries
            WHERE id = ? AND user_id = ?
        ''', (entry_id, user_id))

        deleted_count = cursor.rowcount
        conn.commit()
        conn.close()

        return deleted_count > 0

    def get_user_stats(self, user_id):
        """Get statistics for a user"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # Total entries
        cursor.execute('SELECT COUNT(*) FROM journal_entries WHERE user_id = ?', (user_id,))
        total_entries = cursor.fetchone()[0]

        # Sentiment distribution
        cursor.execute('''
            SELECT sentiment, COUNT(*)
            FROM journal_entries
            WHERE user_id = ?
            GROUP BY sentiment
        ''', (user_id,))
        sentiment_counts = dict(cursor.fetchall())

        # Average mood score
        cursor.execute('''
            SELECT AVG(mood_score)
            FROM journal_entries
            WHERE user_id = ?
        ''', (user_id,))
        avg_mood = cursor.fetchone()[0] or 0

        # Entries this week
        week_ago = (datetime.now() - timedelta(days=7)).isoformat()
        cursor.execute('''
            SELECT COUNT(*)
            FROM journal_entries
            WHERE user_id = ? AND date >= ?
        ''', (user_id, week_ago))
        entries_this_week = cursor.fetchone()[0]

        # Calculate streak
        streak = self.calculate_streak(user_id)

        conn.close()

        return {
            'total_entries': total_entries,
            'sentiment_distribution': sentiment_counts,
            'average_mood': round(avg_mood, 1),
            'entries_this_week': entries_this_week,
            'streak': streak
        }

    def calculate_streak(self, user_id):
        """Calculate consecutive days with journal entries"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # Get all unique dates with entries
        cursor.execute('''
            SELECT DISTINCT DATE(date) as entry_date
            FROM journal_entries
            WHERE user_id = ?
            ORDER BY entry_date DESC
        ''', (user_id,))

        entry_dates = [row[0] for row in cursor.fetchall()]
        conn.close()

        if not entry_dates:
            return 0

        streak = 0
        current_date = datetime.now().date()

        # Check for consecutive days going backwards
        for i in range(30):  # Check up to 30 days
            check_date = current_date - timedelta(days=i)
            check_date_str = check_date.isoformat()

            if check_date_str in entry_dates:
                streak += 1
            elif i > 0:  # Don't break on first day if no entry
                break

        return streak

    def get_weekly_mood_trend(self, user_id, days=7):
        """Get mood trend for the last N days"""
        conn = self.get_connection()
        cursor = conn.cursor()

        trend_data = []

        for i in range(days):
            date = datetime.now().date() - timedelta(days=days-1-i)
            date_str = date.isoformat()

            cursor.execute('''
                SELECT AVG(mood_score)
                FROM journal_entries
                WHERE user_id = ? AND DATE(date) = ?
            ''', (user_id, date_str))

            avg_mood = cursor.fetchone()[0]

            trend_data.append({
                'date': date_str,
                'average_mood': round(avg_mood, 1) if avg_mood else None
            })

        conn.close()
        return trend_data

    def get_time_patterns(self, user_id):
        """Get patterns by time of day"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT
                CASE
                    WHEN CAST(strftime('%H', date) AS INTEGER) < 12 THEN 'morning'
                    WHEN CAST(strftime('%H', date) AS INTEGER) < 18 THEN 'afternoon'
                    ELSE 'evening'
                END as time_period,
                AVG(mood_score) as avg_mood,
                COUNT(*) as entry_count,
                sentiment
            FROM journal_entries
            WHERE user_id = ?
            GROUP BY time_period, sentiment
        ''', (user_id,))

        patterns = {}
        for row in cursor.fetchall():
            period = row[0]
            if period not in patterns:
                patterns[period] = {
                    'average_mood': 0,
                    'entry_count': 0,
                    'sentiment_counts': {}
                }

            patterns[period]['sentiment_counts'][row[3]] = row[2]

        # Calculate overall averages per period
        cursor.execute('''
            SELECT
                CASE
                    WHEN CAST(strftime('%H', date) AS INTEGER) < 12 THEN 'morning'
                    WHEN CAST(strftime('%H', date) AS INTEGER) < 18 THEN 'afternoon'
                    ELSE 'evening'
                END as time_period,
                AVG(mood_score) as avg_mood,
                COUNT(*) as entry_count
            FROM journal_entries
            WHERE user_id = ?
            GROUP BY time_period
        ''', (user_id,))

        for row in cursor.fetchall():
            period = row[0]
            if period in patterns:
                patterns[period]['average_mood'] = round(row[1], 1)
                patterns[period]['entry_count'] = row[2]

        conn.close()
        return patterns

    # ============================================
    # PSYCHOLOGICAL TESTS METHODS
    # ============================================

    def create_test(self, test_type, test_name, description, total_questions, max_score):
        """Create a new psychological test"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO psychological_tests (test_type, test_name, description, total_questions, max_score)
            VALUES (?, ?, ?, ?, ?)
        ''', (test_type, test_name, description, total_questions, max_score))

        test_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return test_id

    def add_test_question(self, test_id, question_number, question_text):
        """Add a question to a test"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO test_questions (test_id, question_number, question_text)
            VALUES (?, ?, ?)
        ''', (test_id, question_number, question_text))

        conn.commit()
        conn.close()

    def add_response_option(self, test_id, option_text, option_value):
        """Add a response option for a test"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO test_response_options (test_id, option_text, option_value)
            VALUES (?, ?, ?)
        ''', (test_id, option_text, option_value))

        conn.commit()
        conn.close()

    def add_score_threshold(self, test_id, min_score, max_score, severity_level, description, recommendations):
        """Add score threshold for a test"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO test_score_thresholds (test_id, min_score, max_score, severity_level, description, recommendations)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (test_id, min_score, max_score, severity_level, description, recommendations))

        conn.commit()
        conn.close()

    def get_all_tests(self):
        """Get all available psychological tests"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, test_type, test_name, description, total_questions, max_score
            FROM psychological_tests
            ORDER BY test_name
        ''')

        tests = []
        for row in cursor.fetchall():
            tests.append({
                'id': row[0],
                'test_type': row[1],
                'test_name': row[2],
                'description': row[3],
                'total_questions': row[4],
                'max_score': row[5]
            })

        conn.close()
        return tests

    def get_test_with_questions(self, test_id):
        """Get test details with all questions and options"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # Get test info
        cursor.execute('''
            SELECT id, test_type, test_name, description, total_questions, max_score
            FROM psychological_tests
            WHERE id = ?
        ''', (test_id,))

        test_row = cursor.fetchone()
        if not test_row:
            conn.close()
            return None

        test = {
            'id': test_row[0],
            'test_type': test_row[1],
            'test_name': test_row[2],
            'description': test_row[3],
            'total_questions': test_row[4],
            'max_score': test_row[5]
        }

        # Get questions
        cursor.execute('''
            SELECT id, question_number, question_text
            FROM test_questions
            WHERE test_id = ?
            ORDER BY question_number
        ''', (test_id,))

        questions = []
        for row in cursor.fetchall():
            questions.append({
                'id': row[0],
                'question_number': row[1],
                'question_text': row[2]
            })

        test['questions'] = questions

        # Get response options
        cursor.execute('''
            SELECT option_text, option_value
            FROM test_response_options
            WHERE test_id = ?
            ORDER BY option_value
        ''', (test_id,))

        options = []
        for row in cursor.fetchall():
            options.append({
                'text': row[0],
                'value': row[1]
            })

        test['response_options'] = options

        conn.close()
        return test

    def save_test_result(self, user_id, test_id, total_score, severity_level, answers, has_crisis):
        """Save user's test result"""
        import json

        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO user_test_results (user_id, test_id, total_score, severity_level, answers, has_crisis_indicators)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, test_id, total_score, severity_level, json.dumps(answers), has_crisis))

        result_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return result_id

    def get_user_test_history(self, user_id, test_id=None, limit=None):
        """Get user's test history"""
        import json

        conn = self.get_connection()
        cursor = conn.cursor()

        if test_id:
            query = '''
                SELECT r.id, r.test_id, t.test_name, r.total_score, r.severity_level,
                       r.answers, r.has_crisis_indicators, r.completed_at
                FROM user_test_results r
                JOIN psychological_tests t ON r.test_id = t.id
                WHERE r.user_id = ? AND r.test_id = ?
                ORDER BY r.completed_at DESC
            '''
            params = (user_id, test_id)
        else:
            query = '''
                SELECT r.id, r.test_id, t.test_name, r.total_score, r.severity_level,
                       r.answers, r.has_crisis_indicators, r.completed_at
                FROM user_test_results r
                JOIN psychological_tests t ON r.test_id = t.id
                WHERE r.user_id = ?
                ORDER BY r.completed_at DESC
            '''
            params = (user_id,)

        if limit:
            query += ' LIMIT ?'
            params = params + (limit,)

        cursor.execute(query, params)

        results = []
        for row in cursor.fetchall():
            # Get interpretation for this score
            interpretation_query = '''
                SELECT description
                FROM test_score_thresholds
                WHERE test_id = ? AND ? BETWEEN min_score AND max_score
            '''
            cursor.execute(interpretation_query, (row[1], row[3]))
            interpretation_row = cursor.fetchone()
            interpretation = interpretation_row[0] if interpretation_row else None

            results.append({
                'id': row[0],
                'test_id': row[1],
                'test_name': row[2],
                'score': row[3],
                'total_score': row[3],
                'severity_level': row[4],
                'answers': json.loads(row[5]),
                'has_crisis_indicators': bool(row[6]),
                'completed_at': row[7],
                'interpretation': interpretation
            })

        conn.close()
        return results

    def get_score_interpretation(self, test_id, score):
        """Get interpretation for a test score"""
        import json

        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT severity_level, description, recommendations
            FROM test_score_thresholds
            WHERE test_id = ? AND ? BETWEEN min_score AND max_score
        ''', (test_id, score))

        row = cursor.fetchone()
        conn.close()

        if row:
            return {
                'severity_level': row[0],
                'description': row[1],
                'recommendations': json.loads(row[2]) if row[2] else []
            }

        return None