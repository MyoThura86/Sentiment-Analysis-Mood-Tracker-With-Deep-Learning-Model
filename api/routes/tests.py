"""
Tests Blueprint

Handles psychological test routes including:
- Test listing
- Test submission
- Test results
- Dashboard statistics
"""
from flask import Blueprint, request, jsonify
import logging

# Import from parent modules
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import MoodTrackingDB
from jwt_utils import require_auth
from translations import translate_test_data

logger = logging.getLogger(__name__)

# Create blueprint
tests_bp = Blueprint('tests', __name__, url_prefix='/api')

# Initialize database
db = MoodTrackingDB()


@tests_bp.route('/tests', methods=['GET', 'OPTIONS'])
def list_tests():
    """
    Get list of available psychological tests
    ---
    tags:
      - Tests
    responses:
      200:
        description: List of available tests
        schema:
          type: object
          properties:
            tests:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  description:
                    type: string
                  questions_count:
                    type: integer
    """
    if request.method == 'OPTIONS':
        return '', 200

    try:
        # Get language from request (default to English)
        language = request.args.get('language', 'en')

        # Get all tests from database
        tests = db.get_all_tests()

        # Enhance with additional info and translate each test
        for test in tests:
            test['duration_minutes'] = test['total_questions'] * 0.5  # ~30 seconds per question
            test = translate_test_data(test, language)

        return jsonify({
            "success": True,
            "tests": tests
        })

    except Exception as e:
        logger.error(f"List tests error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@tests_bp.route('/tests/<int:test_id>', methods=['GET', 'OPTIONS'])
def get_test(test_id):
    """
    Get specific test details including questions
    ---
    tags:
      - Tests
    parameters:
      - in: path
        name: test_id
        required: true
        type: integer
        description: Test ID (1=PHQ-9, 2=GAD-7, etc.)
    responses:
      200:
        description: Test details with questions
      404:
        description: Test not found
    """
    if request.method == 'OPTIONS':
        return '', 200

    try:
        # Get language from request (default to English)
        language = request.args.get('language', 'en')

        # Get test with questions from database
        test = db.get_test_with_questions(test_id)

        if not test:
            return jsonify({"error": "Test not found"}), 404

        # Translate test data, questions, and response options
        test = translate_test_data(test, language)

        return jsonify({
            "success": True,
            "test": test
        })

    except Exception as e:
        logger.error(f"Get test error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@tests_bp.route('/tests/<int:test_id>/submit', methods=['POST', 'OPTIONS'])
@require_auth
def submit_test(current_user, test_id):
    """
    Submit test answers and get results
    ---
    tags:
      - Tests
    security:
      - Bearer: []
    parameters:
      - in: path
        name: test_id
        required: true
        type: integer
      - in: header
        name: Authorization
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - answers
          properties:
            answers:
              type: array
              items:
                type: object
              example: [{"question_number": 1, "value": 0}, {"question_number": 2, "value": 1}]
    responses:
      200:
        description: Test results with score and severity
      400:
        description: Invalid answers
      401:
        description: Unauthorized
    """
    if request.method == 'OPTIONS':
        return '', 200

    # Get user ID from JWT token
    user_id = current_user['user_id']

    try:
        data = request.get_json()
        answers = data.get('answers', [])

        if not answers:
            return jsonify({"error": "Answers required"}), 400

        # Calculate total score - answers are objects with {question_number, value}
        total_score = sum(answer.get('value', 0) for answer in answers)

        # Get test info for max score
        test_info = db.get_test_with_questions(test_id)
        if not test_info:
            return jsonify({"error": "Test not found"}), 404

        # Get interpretation from database
        interpretation = db.get_score_interpretation(test_id, total_score)

        if not interpretation:
            return jsonify({"error": "Could not interpret score"}), 500

        severity_level = interpretation['severity_level']

        # Check for crisis indicators (PHQ-9 Question 9 - suicidal ideation)
        has_crisis = False
        crisis_message = None

        # For PHQ-9, question 9 is about self-harm thoughts
        if test_id == 1:  # PHQ-9
            question_9 = next((a for a in answers if a.get('question_number') == 9), None)
            if question_9 and question_9.get('value', 0) > 0:
                has_crisis = True
                crisis_message = {
                    "alert": True,
                    "title": "Immediate Support Available",
                    "message": "We noticed you're having thoughts of harming yourself. You're not alone, and help is available.",
                    "resources": [
                        {
                            "name": "988 Suicide & Crisis Lifeline",
                            "contact": "Call or text 988",
                            "description": "24/7 free and confidential support"
                        },
                        {
                            "name": "Crisis Text Line",
                            "contact": "Text HOME to 741741",
                            "description": "Free crisis counseling via text"
                        },
                        {
                            "name": "International Association for Suicide Prevention",
                            "contact": "https://www.iasp.info/resources/Crisis_Centres/",
                            "description": "Find help in your country"
                        }
                    ]
                }

        # Save result with correct parameter order
        result_id = db.save_test_result(
            user_id=user_id,
            test_id=test_id,
            total_score=total_score,
            severity_level=severity_level,
            answers=answers,
            has_crisis=has_crisis
        )

        # Build response with proper structure
        response = {
            "success": True,
            "result": {
                "id": result_id,
                "total_score": total_score,
                "max_score": test_info['max_score'],  # Dynamic based on test
                "severity_level": severity_level,
                "description": interpretation['description'],
                "recommendations": interpretation['recommendations']
            }
        }

        if has_crisis:
            response["result"]["crisis"] = crisis_message

        return jsonify(response)

    except Exception as e:
        logger.error(f"Submit test error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@tests_bp.route('/dashboard/stats', methods=['GET', 'OPTIONS'])
@require_auth
def dashboard_stats(current_user):
    """
    Get dashboard statistics including streak and entry counts
    ---
    tags:
      - Dashboard
    security:
      - Bearer: []
    parameters:
      - in: header
        name: Authorization
        required: true
        type: string
    responses:
      200:
        description: Dashboard statistics
        schema:
          type: object
          properties:
            current_streak:
              type: integer
            total_entries:
              type: integer
            total_tests_completed:
              type: integer
            recent_mood_trend:
              type: string
      401:
        description: Unauthorized
    """
    if request.method == 'OPTIONS':
        return '', 200

    # Get user ID from JWT token
    user_id = current_user['user_id']

    try:
        # Get comprehensive stats from database
        user_stats = db.get_user_stats(user_id)
        entries = db.get_journal_entries(user_id)

        return jsonify({
            "current_streak": user_stats.get('current_streak', 0),
            "total_entries": len(entries),
            "total_tests_completed": user_stats.get('total_tests', 0),
            "recent_mood_trend": user_stats.get('mood_trend', 'stable'),
            "last_entry_date": user_stats.get('last_entry_date'),
            "account_created": user_stats.get('created_at')
        })

    except Exception as e:
        logger.error(f"Dashboard stats error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500
