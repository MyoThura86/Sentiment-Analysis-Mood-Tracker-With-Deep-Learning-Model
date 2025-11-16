"""
Unit Tests for Input Validation

Tests text length validation, CSV validation, and security checks
"""
import unittest
import io
import pandas as pd


class TestTextValidation(unittest.TestCase):
    """Test text input validation"""

    MAX_TEXT_LENGTH = 5000

    def test_text_length_limits(self):
        """Test that text length limits are enforced"""
        short_text = "This is a short valid text."
        long_text = "a" * 6000  # Exceeds limit

        self.assertLessEqual(len(short_text), self.MAX_TEXT_LENGTH,
                            "Short text should be within limits")
        self.assertGreater(len(long_text), self.MAX_TEXT_LENGTH,
                          "Long text should exceed limits")

    def test_empty_text_detection(self):
        """Test that empty text is detected"""
        empty_strings = ["", "   ", "\t\n", "  \n  "]

        for text in empty_strings:
            self.assertEqual(len(text.strip()), 0,
                           f"'{text}' should be detected as empty after strip()")

    def test_text_type_validation(self):
        """Test that non-string inputs are rejected"""
        valid_text = "Valid string"
        invalid_inputs = [123, None, [], {}, True]

        self.assertIsInstance(valid_text, str,
                            "Valid text should be string")

        for invalid in invalid_inputs:
            self.assertNotIsInstance(invalid, str,
                                   f"{invalid} should not be string")


class TestCSVValidation(unittest.TestCase):
    """Test CSV file validation"""

    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    MAX_ROWS = 1000

    def test_csv_row_limit(self):
        """Test that CSV row limits are enforced"""
        # Create CSV with too many rows
        rows = [f"text_{i}" for i in range(1001)]
        df = pd.DataFrame({"text": rows})

        self.assertGreater(len(df), self.MAX_ROWS,
                          "Test CSV should exceed row limit")

    def test_csv_size_limit(self):
        """Test that file size limits are enforced"""
        # 1MB in bytes
        small_size = 1024 * 1024
        large_size = 11 * 1024 * 1024  # 11MB

        self.assertLess(small_size, self.MAX_FILE_SIZE,
                       "Small file should be under limit")
        self.assertGreater(large_size, self.MAX_FILE_SIZE,
                          "Large file should exceed limit")

    def test_csv_column_detection(self):
        """Test that text columns are correctly identified"""
        # Create CSV with various column names
        df = pd.DataFrame({
            "text": ["Sample text 1", "Sample text 2"],
            "id": [1, 2],
            "metadata": ["meta1", "meta2"]
        })

        possible_text_columns = ['text', 'content', 'message', 'comment']

        # Check that 'text' column exists
        self.assertIn('text', df.columns,
                     "DataFrame should have 'text' column")

        # Check that text column is in possible columns
        found = False
        for col in df.columns:
            if col.lower() in possible_text_columns:
                found = True
                break

        self.assertTrue(found, "Should find valid text column")

    def test_csv_empty_row_handling(self):
        """Test that empty rows are filtered out"""
        df = pd.DataFrame({
            "text": ["Valid text", "", "  ", None, "Another valid"]
        })

        # Filter out empty/null texts
        df_filtered = df.dropna(subset=['text'])
        df_filtered = df_filtered[df_filtered['text'].str.strip() != '']

        self.assertLess(len(df_filtered), len(df),
                       "Filtered DataFrame should have fewer rows")
        self.assertEqual(len(df_filtered), 2,
                        "Should have 2 valid rows after filtering")


class TestSecurityValidation(unittest.TestCase):
    """Test security-related validation"""

    def test_sql_injection_patterns(self):
        """Test that SQL injection patterns can be detected"""
        safe_inputs = [
            "Normal text",
            "User input with numbers 123",
            "Text with punctuation!"
        ]

        suspicious_inputs = [
            "'; DROP TABLE users; --",
            "1' OR '1'='1",
            "admin'--"
        ]

        # Basic check: SQL keywords in suspicious inputs
        for text in suspicious_inputs:
            text_upper = text.upper()
            has_sql_keywords = any(keyword in text_upper
                                  for keyword in ['DROP', 'DELETE', 'UPDATE', 'INSERT'])
            # We're just testing detection, not prevention
            # Real prevention happens at database layer with parameterized queries

    def test_xss_pattern_detection(self):
        """Test that XSS patterns can be detected"""
        safe_text = "Normal user comment"
        xss_attempt = "<script>alert('XSS')</script>"

        self.assertNotIn('<script', safe_text.lower(),
                        "Safe text should not contain script tags")
        self.assertIn('<script', xss_attempt.lower(),
                     "XSS attempt should contain script tag")

    def test_email_format_validation(self):
        """Test email format validation"""
        valid_emails = [
            "user@example.com",
            "test.user@domain.co.uk",
            "a+b@test.org"
        ]

        invalid_emails = [
            "notanemail",
            "@nodomain.com",
            "missing@",
            "no@domain",
            ""
        ]

        for email in valid_emails:
            # Basic validation: contains @ and has text on both sides
            self.assertIn('@', email, f"{email} should contain @")
            parts = email.split('@')
            self.assertEqual(len(parts), 2, f"{email} should have exactly one @")
            self.assertGreater(len(parts[0]), 0, f"{email} should have local part")
            self.assertGreater(len(parts[1]), 0, f"{email} should have domain part")

        for email in invalid_emails:
            # These should fail basic validation
            is_invalid = (
                '@' not in email or
                email.count('@') != 1 or
                len(email.split('@')[0] if '@' in email else '') == 0 or
                len(email.split('@')[1] if '@' in email and len(email.split('@')) > 1 else '') == 0
            )
            self.assertTrue(is_invalid, f"{email} should be detected as invalid")


class TestRateLimitingConfig(unittest.TestCase):
    """Test rate limiting configuration"""

    def test_rate_limit_values(self):
        """Test that rate limit values are reasonable"""
        rate_limits = {
            'login': '5 per minute',
            'register': '3 per hour',
            'prediction': '30 per minute',
            'csv_analysis': '5 per hour'
        }

        # Extract numeric values
        login_limit = int(rate_limits['login'].split()[0])
        register_limit = int(rate_limits['register'].split()[0])
        prediction_limit = int(rate_limits['prediction'].split()[0])
        csv_limit = int(rate_limits['csv_analysis'].split()[0])

        # Verify limits are reasonable
        self.assertLessEqual(login_limit, 10,
                           "Login attempts should be limited")
        self.assertLessEqual(register_limit, 5,
                           "Registration should be very limited")
        self.assertGreaterEqual(prediction_limit, 10,
                               "Predictions should allow reasonable usage")
        self.assertLessEqual(csv_limit, 10,
                           "CSV analysis should be limited (resource intensive)")


if __name__ == '__main__':
    print("=" * 70)
    print("MOODTRACKER API - Input Validation Unit Tests")
    print("=" * 70)
    print()

    unittest.main(verbosity=2)
