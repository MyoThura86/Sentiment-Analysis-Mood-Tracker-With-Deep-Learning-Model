"""
Database Initialization Script
Initializes all tables and seeds psychological test data
"""
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import MoodTrackingDB
import sqlite3

def verify_tables():
    """Verify that all required tables exist"""
    db_path = "mood_tracking.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]

    print("\n=== Current Database Tables ===")
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"  [OK] {table:30s} ({count} rows)")

    conn.close()

    required_tables = [
        'users',
        'journal_entries',
        'psychological_tests',
        'test_questions',
        'test_response_options',
        'user_test_results',
        'test_score_thresholds'
    ]

    missing_tables = [t for t in required_tables if t not in tables]
    return missing_tables

def main():
    print("=" * 60)
    print("MOODTRACKER DATABASE INITIALIZATION")
    print("=" * 60)

    # Initialize database (creates tables if they don't exist)
    print("\n[1/4] Initializing database tables...")
    db = MoodTrackingDB()
    print("  [OK] Database tables created/verified")

    # Verify all tables exist
    print("\n[2/4] Verifying database structure...")
    missing_tables = verify_tables()

    if missing_tables:
        print(f"\n[WARNING] Missing tables: {missing_tables}")
        print("  Reinitializing database...")
        db = MoodTrackingDB()
        missing_tables = verify_tables()

        if missing_tables:
            print(f"\n[ERROR] Still missing tables: {missing_tables}")
            return False

    # Check if tests are already seeded
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM psychological_tests")
    test_count = cursor.fetchone()[0]
    conn.close()

    if test_count > 0:
        print(f"\n  [OK] Database already seeded with {test_count} tests")
        print("\n[3/4] Skipping test seeding (already complete)")
        print("[4/4] Database initialization complete!")
        print("\n" + "=" * 60)
        print("DATABASE READY")
        print("=" * 60)
        return True

    # Seed psychological tests
    print("\n[3/4] Seeding psychological tests...")

    # Import and run seed scripts
    seed_files = [
        ('seed_phq9', 'PHQ-9 (Depression)'),
        ('seed_gad7', 'GAD-7 (Anxiety)'),
        ('seed_bigfive', 'Big Five Personality'),
        ('seed_pss', 'PSS-10 (Stress)')
    ]

    for seed_file, test_name in seed_files:
        try:
            print(f"  - Seeding {test_name}...", end=" ")
            module = __import__(seed_file)
            if hasattr(module, 'seed_test'):
                module.seed_test()
            elif hasattr(module, 'main'):
                module.main()
            print("[OK]")
        except Exception as e:
            print(f"[ERROR]: {e}")
            continue

    # Verify seeding
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM psychological_tests")
    test_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM test_questions")
    question_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM test_score_thresholds")
    threshold_count = cursor.fetchone()[0]

    conn.close()

    print("\n[4/4] Verifying seeded data...")
    print(f"  [OK] Tests: {test_count}")
    print(f"  [OK] Questions: {question_count}")
    print(f"  [OK] Score Thresholds: {threshold_count}")

    if test_count < 4:
        print(f"\n[WARNING] Expected 4 tests, found {test_count}")

    print("\n" + "=" * 60)
    print("DATABASE INITIALIZATION COMPLETE!")
    print("=" * 60)
    print("\nYou can now start the API server:")
    print("  python start_api.py")
    print("=" * 60)

    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n[FATAL ERROR]: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
