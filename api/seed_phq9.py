#!/usr/bin/env python3
"""Seed PHQ-9 (Depression Screening) test into database"""

from database import MoodTrackingDB
import json

def seed_phq9():
    db = MoodTrackingDB('mood_tracking.db')

    print("Seeding PHQ-9 test...")

    # Create the test
    test_id = db.create_test(
        test_type='PHQ9',
        test_name='PHQ-9 Depression Screening',
        description='The Patient Health Questionnaire-9 (PHQ-9) is a brief screening tool for depression. Over the past 2 weeks, how often have you been bothered by the following problems?',
        total_questions=9,
        max_score=27
    )

    print(f"Created test with ID: {test_id}")

    # PHQ-9 Questions
    questions = [
        "Little interest or pleasure in doing things",
        "Feeling down, depressed, or hopeless",
        "Trouble falling or staying asleep, or sleeping too much",
        "Feeling tired or having little energy",
        "Poor appetite or overeating",
        "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
        "Trouble concentrating on things, such as reading the newspaper or watching television",
        "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
        "Thoughts that you would be better off dead, or of hurting yourself"
    ]

    # Add questions
    for i, question in enumerate(questions, 1):
        db.add_test_question(test_id, i, question)

    print(f"Added {len(questions)} questions")

    # Response options (same for all questions)
    response_options = [
        ("Not at all", 0),
        ("Several days", 1),
        ("More than half the days", 2),
        ("Nearly every day", 3)
    ]

    for text, value in response_options:
        db.add_response_option(test_id, text, value)

    print(f"Added {len(response_options)} response options")

    # Score thresholds with recommendations
    thresholds = [
        {
            'min_score': 0,
            'max_score': 4,
            'severity': 'minimal',
            'description': 'Minimal or no depression',
            'recommendations': [
                'Continue with regular self-care activities',
                'Keep journaling to track your mood',
                'Maintain healthy sleep and exercise habits',
                'Consider retaking this assessment in 2 weeks'
            ]
        },
        {
            'min_score': 5,
            'max_score': 9,
            'severity': 'mild',
            'description': 'Mild depression',
            'recommendations': [
                'Monitor your symptoms closely',
                'Engage in regular physical activity',
                'Practice stress-reduction techniques',
                'Talk to friends or family about how you feel',
                'Consider professional support if symptoms persist'
            ]
        },
        {
            'min_score': 10,
            'max_score': 14,
            'severity': 'moderate',
            'description': 'Moderate depression',
            'recommendations': [
                'We recommend speaking with a mental health professional',
                'Consider therapy or counseling',
                'Maintain regular routines and social connections',
                'Continue journaling and tracking your mood',
                'Avoid isolation - stay connected with supportive people'
            ]
        },
        {
            'min_score': 15,
            'max_score': 19,
            'severity': 'moderately_severe',
            'description': 'Moderately severe depression',
            'recommendations': [
                'Please consult with a mental health professional soon',
                'Professional treatment is strongly recommended',
                'Therapy and/or medication may be beneficial',
                'Reach out to your support network',
                'Contact a crisis hotline if you need immediate support'
            ]
        },
        {
            'min_score': 20,
            'max_score': 27,
            'severity': 'severe',
            'description': 'Severe depression',
            'recommendations': [
                'Please seek professional help immediately',
                'Contact a mental health provider today',
                'Consider visiting an emergency room if in crisis',
                'Call 988 Suicide & Crisis Lifeline',
                'You deserve support - please reach out for help'
            ]
        }
    ]

    for threshold in thresholds:
        db.add_score_threshold(
            test_id=test_id,
            min_score=threshold['min_score'],
            max_score=threshold['max_score'],
            severity_level=threshold['severity'],
            description=threshold['description'],
            recommendations=json.dumps(threshold['recommendations'])
        )

    print(f"Added {len(thresholds)} score thresholds")
    print("\n✅ PHQ-9 seeded successfully!")

    # Verify
    test = db.get_test_with_questions(test_id)
    print(f"\nVerification:")
    print(f"- Test: {test['test_name']}")
    print(f"- Questions: {len(test['questions'])}")
    print(f"- Response options: {len(test['response_options'])}")

if __name__ == '__main__':
    seed_phq9()
