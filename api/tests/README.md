# MoodTracker API - Unit Tests

## Overview

This directory contains unit tests for critical functions in the MoodTracker API.

## Test Coverage

### 1. Authentication Tests (`test_auth.py`)

- **Password Hashing**: Tests Argon2 password hashing
  - Hash format validation
  - Password verification
  - Salt uniqueness
  - Legacy SHA256 support

- **JWT Tokens**: Tests JSON Web Token functionality
  - Token creation
  - Token verification
  - Claims validation
  - Invalid token handling

- **User Management**: Tests user creation and validation
  - Email format validation
  - Password requirements

### 2. Validation Tests (`test_validation.py`)

- **Text Validation**: Input text validation
  - Length limits (5000 chars)
  - Empty text detection
  - Type validation

- **CSV Validation**: CSV file validation
  - Row limits (1000 rows max)
  - File size limits (10MB max)
  - Column detection
  - Empty row handling

- **Security Validation**: Security checks
  - SQL injection pattern detection
  - XSS pattern detection
  - Email format validation

- **Rate Limiting**: Configuration validation
  - Rate limit values are reasonable
  - Different limits for different endpoints

## Running Tests

### Run All Tests

```bash
cd api/tests
python run_tests.py
```

### Run Specific Test File

```bash
# Authentication tests only
python test_auth.py

# Validation tests only
python test_validation.py
```

### Run Specific Test Class

```bash
python -m unittest test_auth.TestPasswordHashing
python -m unittest test_validation.TestCSVValidation
```

### Run Specific Test Method

```bash
python -m unittest test_auth.TestPasswordHashing.test_password_hash_format
```

## Test Results

All tests should pass for Phase 3 completion. If any tests fail:

1. Check that all dependencies are installed (`pip install -r requirements.txt`)
2. Ensure environment variables are configured (`.env` files)
3. Verify database files are accessible
4. Check that models are loaded (if testing predictions)

## Adding New Tests

When adding new features, follow this pattern:

```python
import unittest

class TestNewFeature(unittest.TestCase):
    """Test description"""

    def setUp(self):
        """Set up test fixtures"""
        pass

    def test_specific_behavior(self):
        """Test a specific behavior"""
        # Arrange
        expected = "value"

        # Act
        result = function_to_test()

        # Assert
        self.assertEqual(result, expected, "Error message")

if __name__ == '__main__':
    unittest.main(verbosity=2)
```

## Integration Tests

These are **unit tests** that test individual functions in isolation.

For **integration tests** (testing full API endpoints), consider using:
- `pytest` with `pytest-flask`
- `requests` library for API calls
- Test database with fixtures

## Continuous Integration

To integrate with CI/CD:

```yaml
# Example GitHub Actions
- name: Run tests
  run: |
    cd api/tests
    python run_tests.py
```

## Test Data

Tests use minimal fixtures and mock data. No real user data or production databases are used.

## Coverage Goals

Current coverage areas:
- ✅ Authentication (password hashing, JWT)
- ✅ Input validation
- ✅ Security checks
- ✅ Configuration validation

Future coverage areas:
- ⏳ ML model predictions
- ⏳ Database operations
- ⏳ API endpoint integration tests
- ⏳ OAuth flows

## Dependencies

Tests require:
- `unittest` (built-in)
- `pandas` (for CSV testing)
- All API dependencies from `requirements.txt`

## Best Practices

1. **Isolation**: Tests should not depend on each other
2. **Repeatability**: Tests should produce same results every run
3. **Fast**: Unit tests should run quickly (< 1 second each)
4. **Clear**: Test names should describe what they test
5. **Assertions**: Use descriptive assertion messages

## Troubleshooting

### Import Errors

If you see import errors, ensure you're running from the correct directory:

```bash
cd api/tests
python run_tests.py
```

### Path Issues

Tests add the parent directory to `sys.path` automatically. If this fails, manually set:

```bash
export PYTHONPATH="${PYTHONPATH}:/path/to/api"
```

### Database Errors

Some tests may require database access. Ensure:
- Database files are in the correct location
- Permissions are set correctly
- Database schema is initialized

## Phase 3 Completion

These tests are part of Phase 3 requirements:
- ✅ Created test structure
- ✅ Authentication tests
- ✅ Validation tests
- ✅ Test runner
- ✅ Documentation

**Next Steps**: Expand test coverage to include ML predictions and API integration tests.
