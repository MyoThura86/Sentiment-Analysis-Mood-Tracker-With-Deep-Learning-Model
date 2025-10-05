#!/usr/bin/env python3
"""Seed GAD-7 (Anxiety Screening) test into database"""

from database import MoodTrackingDB
import json

def seed_gad7():
    db = MoodTrackingDB('mood_tracking.db')

    print("Seeding GAD-7 test...")

    # Create the test
    test_id = db.create_test(
        test_type='GAD7',
        test_name='GAD-7 Anxiety Screening',
        description='The Generalized Anxiety Disorder-7 (GAD-7) is a brief screening tool for anxiety. Over the past 2 weeks, how often have you been bothered by the following problems?',
        total_questions=7,
        max_score=21
    )

    print(f"Created test with ID: {test_id}")

    # GAD-7 Questions
    questions = [
        "Feeling nervous, anxious, or on edge",
        "Not being able to stop or control worrying",
        "Worrying too much about different things",
        "Trouble relaxing",
        "Being so restless that it's hard to sit still",
        "Becoming easily annoyed or irritable",
        "Feeling afraid as if something awful might happen"
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
            'description': 'Minimal anxiety',
            'recommendations': [
                'Your anxiety levels appear to be minimal',
                'Continue with regular self-care activities',
                'Practice mindfulness and stress management',
                'Maintain healthy lifestyle habits',
                'Consider retaking this assessment in 2 weeks'
            ]
        },
        {
            'min_score': 5,
            'max_score': 9,
            'severity': 'mild',
            'description': 'Mild anxiety',
            'recommendations': [
                'Monitor your symptoms and triggers',
                'Practice relaxation techniques like deep breathing',
                'Engage in regular physical activity',
                'Limit caffeine and alcohol intake',
                'Consider mindfulness or meditation apps',
                'Talk to friends or family about your concerns'
            ]
        },
        {
            'min_score': 10,
            'max_score': 14,
            'severity': 'moderate',
            'description': 'Moderate anxiety',
            'recommendations': [
                'We recommend speaking with a mental health professional',
                'Consider cognitive behavioral therapy (CBT)',
                'Practice daily relaxation exercises',
                'Maintain regular sleep and eating schedules',
                'Limit exposure to anxiety triggers when possible',
                'Join a support group for anxiety management'
            ]
        },
        {
            'min_score': 15,
            'max_score': 21,
            'severity': 'severe',
            'description': 'Severe anxiety',
            'recommendations': [
                'Please consult with a mental health professional soon',
                'Professional treatment is strongly recommended',
                'Therapy and/or medication may be very helpful',
                'Practice grounding techniques during anxiety episodes',
                'Reach out to your support network',
                'Contact a crisis hotline if you need immediate support',
                'Consider visiting urgent care if anxiety is overwhelming'
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
    print("\n✅ GAD-7 seeded successfully!")

    # Verify
    test = db.get_test_with_questions(test_id)
    print(f"\nVerification:")
    print(f"- Test: {test['test_name']}")
    print(f"- Questions: {len(test['questions'])}")
    print(f"- Response options: {len(test['response_options'])}")

if __name__ == '__main__':
    seed_gad7()
