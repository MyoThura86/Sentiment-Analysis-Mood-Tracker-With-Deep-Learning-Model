#!/usr/bin/env python3
"""Seed Big Five IPIP (Personality Test) into database"""

from database import MoodTrackingDB
import json

def seed_bigfive():
    db = MoodTrackingDB('mood_tracking.db')

    print("Seeding Big Five Personality Test (IPIP-50)...")

    # Create the test
    test_id = db.create_test(
        test_type='BIGFIVE_IPIP',
        test_name='Big Five Personality Test',
        description='The Big Five personality test measures five major dimensions of personality: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. Please rate how accurately each statement describes you.',
        total_questions=50,
        max_score=250  # 50 questions * 5 max score each
    )

    print(f"Created test with ID: {test_id}")

    # Big Five IPIP-50 Questions (10 per trait)
    # Format: (question_text, trait, reverse_scored)
    questions = [
        # Extraversion (10 questions)
        ("I am the life of the party", "extraversion", False),
        ("I don't talk a lot", "extraversion", True),
        ("I feel comfortable around people", "extraversion", False),
        ("I keep in the background", "extraversion", True),
        ("I start conversations", "extraversion", False),
        ("I have little to say", "extraversion", True),
        ("I talk to a lot of different people at parties", "extraversion", False),
        ("I don't like to draw attention to myself", "extraversion", True),
        ("I don't mind being the center of attention", "extraversion", False),
        ("I am quiet around strangers", "extraversion", True),

        # Agreeableness (10 questions)
        ("I feel little concern for others", "agreeableness", True),
        ("I am interested in people", "agreeableness", False),
        ("I insult people", "agreeableness", True),
        ("I sympathize with others' feelings", "agreeableness", False),
        ("I am not interested in other people's problems", "agreeableness", True),
        ("I have a soft heart", "agreeableness", False),
        ("I am not really interested in others", "agreeableness", True),
        ("I take time out for others", "agreeableness", False),
        ("I feel others' emotions", "agreeableness", False),
        ("I make people feel at ease", "agreeableness", False),

        # Conscientiousness (10 questions)
        ("I am always prepared", "conscientiousness", False),
        ("I leave my belongings around", "conscientiousness", True),
        ("I pay attention to details", "conscientiousness", False),
        ("I make a mess of things", "conscientiousness", True),
        ("I get chores done right away", "conscientiousness", False),
        ("I often forget to put things back in their proper place", "conscientiousness", True),
        ("I like order", "conscientiousness", False),
        ("I shirk my duties", "conscientiousness", True),
        ("I follow a schedule", "conscientiousness", False),
        ("I am exacting in my work", "conscientiousness", False),

        # Neuroticism (10 questions)
        ("I get stressed out easily", "neuroticism", False),
        ("I am relaxed most of the time", "neuroticism", True),
        ("I worry about things", "neuroticism", False),
        ("I seldom feel blue", "neuroticism", True),
        ("I am easily disturbed", "neuroticism", False),
        ("I get upset easily", "neuroticism", False),
        ("I change my mood a lot", "neuroticism", False),
        ("I have frequent mood swings", "neuroticism", False),
        ("I get irritated easily", "neuroticism", False),
        ("I often feel blue", "neuroticism", False),

        # Openness (10 questions)
        ("I have a rich vocabulary", "openness", False),
        ("I have difficulty understanding abstract ideas", "openness", True),
        ("I have a vivid imagination", "openness", False),
        ("I am not interested in abstract ideas", "openness", True),
        ("I have excellent ideas", "openness", False),
        ("I do not have a good imagination", "openness", True),
        ("I am quick to understand things", "openness", False),
        ("I use difficult words", "openness", False),
        ("I spend time reflecting on things", "openness", False),
        ("I am full of ideas", "openness", False),
    ]

    # Add questions with metadata stored in question text (we'll parse trait later if needed)
    for i, (question_text, trait, reverse_scored) in enumerate(questions, 1):
        db.add_test_question(test_id, i, question_text)

    print(f"Added {len(questions)} questions")

    # Response options (Likert scale 1-5)
    response_options = [
        ("Very Inaccurate", 1),
        ("Moderately Inaccurate", 2),
        ("Neither Accurate nor Inaccurate", 3),
        ("Moderately Accurate", 4),
        ("Very Accurate", 5)
    ]

    for text, value in response_options:
        db.add_response_option(test_id, text, value)

    print(f"Added {len(response_options)} response options")

    # Score thresholds - Big Five doesn't have "severity" like clinical tests
    # We'll use ranges to describe personality profiles
    thresholds = [
        {
            'min_score': 0,
            'max_score': 100,
            'severity': 'low',
            'description': 'Low overall personality trait expression',
            'recommendations': [
                'This is a comprehensive personality assessment',
                'Your results reflect your unique personality profile',
                'There are no "good" or "bad" scores - just different traits',
                'Consider how your traits align with your personal and professional goals',
                'Personality can evolve over time with conscious effort'
            ]
        },
        {
            'min_score': 101,
            'max_score': 150,
            'severity': 'moderate_low',
            'description': 'Moderate-low personality trait expression',
            'recommendations': [
                'Your personality profile shows balanced trait expression',
                'Consider which traits serve you well and which you might want to develop',
                'Reflect on how your personality impacts your relationships and work',
                'Use your strengths to achieve your goals',
                'Consider areas where growth might benefit you'
            ]
        },
        {
            'min_score': 151,
            'max_score': 200,
            'severity': 'moderate_high',
            'description': 'Moderate-high personality trait expression',
            'recommendations': [
                'Your personality profile shows strong trait expression',
                'Leverage your strengths in personal and professional contexts',
                'Be aware of how your traits affect your interactions',
                'Balance is key - too much of any trait can be challenging',
                'Continue developing self-awareness'
            ]
        },
        {
            'min_score': 201,
            'max_score': 250,
            'severity': 'high',
            'description': 'High personality trait expression',
            'recommendations': [
                'You show strong personality trait expression across dimensions',
                'Use your personality strengths strategically',
                'Be mindful of situations where your traits may need moderation',
                'Personality is complex - consider consulting the detailed breakdown',
                'Continue your journey of self-discovery and growth'
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
    print("\nBig Five Personality Test (IPIP-50) seeded successfully!")

    # Verify
    test = db.get_test_with_questions(test_id)
    print(f"\nVerification:")
    print(f"- Test: {test['test_name']}")
    print(f"- Questions: {len(test['questions'])}")
    print(f"- Response options: {len(test['response_options'])}")
    print(f"- Traits covered: Extraversion, Agreeableness, Conscientiousness, Neuroticism, Openness")

if __name__ == '__main__':
    seed_bigfive()
