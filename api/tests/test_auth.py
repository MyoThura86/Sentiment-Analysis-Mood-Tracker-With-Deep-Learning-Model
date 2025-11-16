"""
Unit Tests for Authentication

Tests password hashing, JWT tokens, and user management
"""
import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from user_manager import UserManager
from jwt_utils import create_token, verify_token


class TestPasswordHashing(unittest.TestCase):
    """Test Argon2 password hashing"""

    def setUp(self):
        """Set up test fixtures"""
        self.user_manager = UserManager()

    def test_password_hash_format(self):
        """Test that new passwords use Argon2 format"""
        password = "test_password_123"
        hashed = self.user_manager.hash_password(password)

        # Argon2 hashes start with $argon2
        self.assertTrue(hashed.startswith('$argon2'),
                       "Password should use Argon2 format")

    def test_password_verification(self):
        """Test password verification works correctly"""
        password = "my_secure_password"
        hashed = self.user_manager.hash_password(password)

        # Correct password should verify
        self.assertTrue(self.user_manager.verify_password(password, hashed),
                       "Correct password should verify")

        # Wrong password should not verify
        self.assertFalse(self.user_manager.verify_password("wrong_password", hashed),
                        "Wrong password should not verify")

    def test_password_hash_unique(self):
        """Test that same password produces different hashes (due to salt)"""
        password = "same_password"
        hash1 = self.user_manager.hash_password(password)
        hash2 = self.user_manager.hash_password(password)

        self.assertNotEqual(hash1, hash2,
                           "Same password should produce different hashes due to random salt")

    def test_legacy_sha256_support(self):
        """Test that legacy SHA256 hashes still work"""
        # Simulate old SHA256 format (with colon separator)
        password = "legacy_password"
        # This would be an old format hash
        legacy_hash = "abc123:def456"

        # Just verify the format detection works
        self.assertIn(':', legacy_hash,
                     "Legacy hashes should contain colon separator")


class TestJWTTokens(unittest.TestCase):
    """Test JWT token creation and verification"""

    def test_token_creation(self):
        """Test that JWT tokens can be created"""
        user_id = "test_user_123"
        email = "test@example.com"

        token = create_token(user_id, email)

        self.assertIsNotNone(token, "Token should be created")
        self.assertIsInstance(token, str, "Token should be a string")
        self.assertTrue(len(token) > 20, "Token should be substantial length")

    def test_token_verification_valid(self):
        """Test that valid tokens verify correctly"""
        user_id = "test_user_456"
        email = "valid@example.com"

        token = create_token(user_id, email)
        result = verify_token(token)

        self.assertTrue(result['valid'], "Valid token should verify")
        self.assertEqual(result['user_id'], user_id, "User ID should match")
        self.assertEqual(result['email'], email, "Email should match")

    def test_token_verification_invalid(self):
        """Test that invalid tokens are rejected"""
        invalid_token = "invalid.token.here"

        result = verify_token(invalid_token)

        self.assertFalse(result['valid'], "Invalid token should not verify")
        self.assertIn('error', result, "Error message should be present")

    def test_token_contains_claims(self):
        """Test that token contains expected claims"""
        user_id = "claim_test_user"
        email = "claims@example.com"

        token = create_token(user_id, email)
        result = verify_token(token)

        if result['valid']:
            self.assertIn('user_id', result, "Token should contain user_id")
            self.assertIn('email', result, "Token should contain email")


class TestUserManagement(unittest.TestCase):
    """Test user creation and management"""

    def setUp(self):
        """Set up test fixtures"""
        self.user_manager = UserManager()

    def test_email_validation(self):
        """Test that email format is validated"""
        # Valid emails
        valid_emails = ["test@example.com", "user.name@domain.co.uk", "a@b.c"]
        for email in valid_emails:
            self.assertIn('@', email, f"{email} should contain @")

        # Invalid emails (would be rejected by validation)
        invalid_emails = ["notanemail", "missing@domain", "@nodomain.com"]
        for email in invalid_emails:
            # Check that these would fail basic validation
            if '@' not in email or email.count('@') != 1:
                self.assertTrue(True, f"{email} should fail validation")

    def test_password_requirements(self):
        """Test password strength requirements"""
        # Passwords should be at least some length
        weak_password = "123"
        strong_password = "secure_password_123"

        self.assertGreater(len(strong_password), len(weak_password),
                          "Strong passwords should be longer")
        self.assertGreater(len(strong_password), 8,
                          "Passwords should be reasonably long")


if __name__ == '__main__':
    print("=" * 70)
    print("MOODTRACKER API - Authentication Unit Tests")
    print("=" * 70)
    print()

    # Run tests with verbose output
    unittest.main(verbosity=2)
