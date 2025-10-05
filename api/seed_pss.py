#!/usr/bin/env python3
"""Seed PSS-10 (Perceived Stress Scale) test into database"""

from database import MoodTrackingDB
import json

def seed_pss():
    db = MoodTrackingDB('mood_tracking.db')

    print("Seeding Perceived Stress Scale (PSS-10)...")

    # Create the test
    test_id = db.create_test(
        test_type='PSS10',
        test_name='Perceived Stress Scale (PSS-10)',
        description='The Perceived Stress Scale (PSS-10) is a widely used psychological instrument for measuring the perception of stress. In the last month, how often have you experienced the following?',
        total_questions=10,
        max_score=40
    )

    print(f"Created test with ID: {test_id}")

    # PSS-10 Questions
    # Questions 4, 5, 7, and 8 are positively stated (reverse scored)
    questions = [
        "In the last month, how often have you been upset because of something that happened unexpectedly?",
        "In the last month, how often have you felt that you were unable to control the important things in your life?",
        "In the last month, how often have you felt nervous and stressed?",
        "In the last month, how often have you felt confident about your ability to handle your personal problems?",  # Reverse scored
        "In the last month, how often have you felt that things were going your way?",  # Reverse scored
        "In the last month, how often have you found that you could not cope with all the things that you had to do?",
        "In the last month, how often have you been able to control irritations in your life?",  # Reverse scored
        "In the last month, how often have you felt that you were on top of things?",  # Reverse scored
        "In the last month, how often have you been angered because of things that were outside of your control?",
        "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
    ]

    # Add questions
    for i, question in enumerate(questions, 1):
        db.add_test_question(test_id, i, question)

    print(f"Added {len(questions)} questions")

    # Response options (0-4 scale)
    response_options = [
        ("Never", 0),
        ("Almost Never", 1),
        ("Sometimes", 2),
        ("Fairly Often", 3),
        ("Very Often", 4)
    ]

    for text, value in response_options:
        db.add_response_option(test_id, text, value)

    print(f"Added {len(response_options)} response options")

    # Score thresholds with recommendations
    # PSS-10 scoring: 0-13 (low stress), 14-26 (moderate stress), 27-40 (high stress)
    thresholds = [
        {
            'min_score': 0,
            'max_score': 13,
            'severity': 'low',
            'description': 'Low perceived stress',
            'recommendations': [
                'Your stress levels appear to be well-managed',
                'Continue your current stress management strategies',
                'Maintain healthy lifestyle habits and self-care routines',
                'Stay aware of potential stressors and address them early',
                'Consider sharing your coping strategies with others',
                'Regular check-ins can help maintain low stress levels'
            ]
        },
        {
            'min_score': 14,
            'max_score': 26,
            'severity': 'moderate',
            'description': 'Moderate perceived stress',
            'recommendations': [
                'Your stress levels are in the moderate range',
                'Consider implementing regular stress-reduction techniques',
                'Practice mindfulness, meditation, or deep breathing exercises',
                'Ensure adequate sleep, nutrition, and physical activity',
                'Identify your main stressors and develop coping strategies',
                'Talk to friends, family, or a counselor about your stress',
                'Set boundaries and learn to say no when necessary',
                'Take regular breaks and prioritize self-care'
            ]
        },
        {
            'min_score': 27,
            'max_score': 40,
            'severity': 'high',
            'description': 'High perceived stress',
            'recommendations': [
                'Your stress levels are significantly elevated',
                'We strongly recommend seeking professional support',
                'Consider consulting a mental health professional or counselor',
                'Chronic high stress can impact physical and mental health',
                'Practice daily stress-reduction techniques',
                'Identify and address major sources of stress in your life',
                'Build a strong support network of friends and family',
                'Consider stress management programs or therapy',
                'Take immediate steps to reduce your stress load',
                'Prioritize self-care and set firm boundaries'
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
    print("\nPSS-10 seeded successfully!")

    # Verify
    test = db.get_test_with_questions(test_id)
    print(f"\nVerification:")
    print(f"- Test: {test['test_name']}")
    print(f"- Questions: {len(test['questions'])}")
    print(f"- Response options: {len(test['response_options'])}")
    print(f"\nNote: Questions 4, 5, 7, and 8 are reverse-scored items")
    print("(measuring positive coping and control)")

if __name__ == '__main__':
    seed_pss()
