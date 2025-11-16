"""
Journal Blueprint

Handles all journal and mood tracking routes including:
- Journal entries CRUD
- Analytics and insights
- Notifications
"""
from flask import Blueprint, request, jsonify
import logging

# Import from parent modules
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import MoodTrackingDB
from jwt_utils import require_auth

logger = logging.getLogger(__name__)

# Create blueprint
journal_bp = Blueprint('journal', __name__, url_prefix='/api/journal')

# Initialize database
db = MoodTrackingDB()


@journal_bp.route('/entries', methods=['GET', 'POST', 'DELETE', 'OPTIONS'])
@require_auth
def journal_entries(current_user):
    """
    Get all journal entries or create a new entry
    ---
    tags:
      - Journal
    security:
      - Bearer: []
    parameters:
      - in: header
        name: Authorization
        required: true
        type: string
        description: Bearer JWT token
      - in: body
        name: body
        required: false
        schema:
          type: object
          properties:
            content:
              type: string
            mood:
              type: string
    responses:
      200:
        description: Journal entries or creation result
      401:
        description: Unauthorized
    """
    if request.method == 'OPTIONS':
        return '', 200

    # Get user ID from JWT token
    user_id = current_user['user_id']

    try:
        if request.method == 'GET':
            # Get journal entries for user from database
            entries = db.get_journal_entries(user_id)

            return jsonify({
                "success": True,
                "entries": entries,
                "total": len(entries)
            })

        elif request.method == 'POST':
            # Create new journal entry
            data = request.get_json()

            if not data or 'text' not in data:
                return jsonify({"error": "Text is required"}), 400

            text = data['text']
            if not text.strip():
                return jsonify({"error": "Empty text provided"}), 400

            # Analyze sentiment using the simple model
            from simple_model import predict_with_simple_model
            sentiment_result = predict_with_simple_model(text)

            # Extract sentiment data
            primary_sentiment = sentiment_result.get('sentiment', 'Neutral')
            primary_confidence = sentiment_result.get('confidence', 0.5)
            scores = sentiment_result.get('scores', {})

            # Calculate mood score (1-10 scale)
            mood_score = (scores.get('positive', 0) * 10) + (scores.get('neutral', 0) * 5.5) + (scores.get('negative', 0) * 2)

            # Store entry in database with all required parameters
            analysis_data = {
                "sentiment_analysis": sentiment_result
            }

            entry_id = db.create_journal_entry(
                user_id=user_id,
                text=text,
                sentiment=primary_sentiment,
                confidence=float(primary_confidence),
                mood_score=round(float(mood_score), 1),
                scores=scores,
                tags=data.get('tags', []),
                analysis=analysis_data
            )

            if entry_id:
                # Get the created entry back from database
                entries = db.get_journal_entries(user_id, limit=1)
                new_entry = entries[0] if entries else None

                return jsonify({
                    "success": True,
                    "entry": new_entry,
                    "entry_id": entry_id,
                    "message": "Journal entry created successfully",
                    "ai_analysis": sentiment_result
                }), 201
            else:
                return jsonify({"error": "Failed to create entry"}), 500

    except Exception as e:
        logger.error(f"Journal entries error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@journal_bp.route('/entries/<int:entry_id>', methods=['DELETE', 'OPTIONS'])
@require_auth
def delete_journal_entry(current_user, entry_id):
    """
    Delete a specific journal entry
    ---
    tags:
      - Journal
    security:
      - Bearer: []
    parameters:
      - in: path
        name: entry_id
        required: true
        type: integer
      - in: header
        name: Authorization
        required: true
        type: string
    responses:
      200:
        description: Entry deleted successfully
      401:
        description: Unauthorized
      404:
        description: Entry not found
    """
    if request.method == 'OPTIONS':
        return '', 200

    # Get user ID from JWT token
    user_id = current_user['user_id']

    try:
        # Delete entry from database
        deleted = db.delete_journal_entry(user_id, entry_id)

        if deleted:
            return jsonify({
                "success": True,
                "message": "Entry deleted successfully"
            })
        else:
            return jsonify({"error": "Entry not found or unauthorized"}), 404

    except Exception as e:
        logger.error(f"Delete journal entry error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@journal_bp.route('/analytics', methods=['GET', 'OPTIONS'])
@require_auth
def journal_analytics(current_user):
    """
    Get analytics data for journal entries
    ---
    tags:
      - Journal
    security:
      - Bearer: []
    parameters:
      - in: header
        name: Authorization
        required: true
        type: string
      - in: query
        name: days
        type: integer
        default: 30
        description: Number of days to analyze
    responses:
      200:
        description: Analytics data
        schema:
          type: object
          properties:
            mood_trends:
              type: array
            sentiment_distribution:
              type: object
            total_entries:
              type: integer
      401:
        description: Unauthorized
    """
    if request.method == 'OPTIONS':
        return '', 200

    # Get user ID from JWT token
    user_id = current_user['user_id']

    try:
        # Get user's journal entries from database
        entries = db.get_journal_entries(user_id)

        if len(entries) == 0:
            return jsonify({
                "message": "No entries found",
                "mood_trends": [],
                "sentiment_distribution": {"Positive": 0, "Neutral": 0, "Negative": 0},
                "total_entries": 0
            })

        # Calculate sentiment distribution
        sentiment_counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
        for entry in entries:
            sentiment = entry.get('sentiment', 'Neutral')
            if sentiment in sentiment_counts:
                sentiment_counts[sentiment] += 1

        # Get mood trends over time
        mood_trends = db.get_mood_trends(user_id, days=30)

        return jsonify({
            "total_entries": len(entries),
            "sentiment_distribution": sentiment_counts,
            "mood_trends": mood_trends,
            "average_sentiment_score": sum(e.get('sentiment_score', 0.5) for e in entries) / len(entries)
        })

    except Exception as e:
        logger.error(f"Journal analytics error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500
