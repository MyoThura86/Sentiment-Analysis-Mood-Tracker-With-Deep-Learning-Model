import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  Container,
  Paper,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import { testsApi } from '../../api/testsApi';
import { useTranslation } from '../../../hooks/useTranslation';

const TakeTest = ({ user, onSignOut }) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showConsent, setShowConsent] = useState(true);

  useEffect(() => {
    loadTest();
  }, [testId, language]);

  const loadTest = async () => {
    try {
      const result = await testsApi.getTest(parseInt(testId));
      if (result.success) {
        setTest(result.test);
        // Initialize answers
        const initialAnswers = {};
        result.test.questions.forEach(q => {
          initialAnswers[q.question_number] = null;
        });
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error('Error loading test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionNumber, value) => {
    setAnswers({
      ...answers,
      [questionNumber]: parseInt(value)
    });
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    navigate(`/tests/${testId}/results`, {
      state: { answers, test }
    });
  };

  const isCurrentQuestionAnswered = () => {
    const questionNumber = test.questions[currentQuestion].question_number;
    return answers[questionNumber] !== null;
  };

  const allQuestionsAnswered = () => {
    return Object.values(answers).every(answer => answer !== null);
  };

  const getProgress = () => {
    const answeredCount = Object.values(answers).filter(a => a !== null).length;
    return (answeredCount / test.questions.length) * 100;
  };

  if (loading) {
    return (
      <PageLayout user={user} onSignOut={onSignOut}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <LinearProgress />
        </Container>
      </PageLayout>
    );
  }

  if (!test) {
    return (
      <PageLayout user={user} onSignOut={onSignOut}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error">Test not found</Alert>
        </Container>
      </PageLayout>
    );
  }

  // Consent Screen
  if (showConsent) {
    return (
      <PageLayout user={user} onSignOut={onSignOut}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {test.test_name}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Alert severity="info" sx={{ mb: 3 }}>
                <AlertTitle>{test.test_name}</AlertTitle>
                {test.description}
              </Alert>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                {t('testsPage.disclaimer.title')}
              </Typography>

              <Box component="ul" sx={{ mt: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  {t('tooltips.screeningTool')}
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  {test.total_questions} {t('testsPage.testCard.questions')} - {Math.ceil(test.total_questions * 0.5)} {t('testsPage.testCard.minutes')}
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  {t('testTaking.overLast2Weeks')}
                </Typography>
                <Typography component="li" variant="body2">
                  {t('testResults.recommendations')}
                </Typography>
              </Box>

              <Alert severity="warning" sx={{ mt: 3, mb: 3 }}>
                <AlertTitle>{t('testsPage.disclaimer.title')}</AlertTitle>
                {t('testsPage.disclaimer.text')}
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/tests')}
                  fullWidth
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setShowConsent(false)}
                  fullWidth
                >
                  {t('testTaking.next')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </PageLayout>
    );
  }

  const question = test.questions[currentQuestion];

  return (
    <PageLayout user={user} onSignOut={onSignOut}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('testTaking.question')} {currentQuestion + 1} {t('testTaking.of')} {test.questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(getProgress())}% {t('testTaking.progress')}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getProgress()}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Question Card */}
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {question.question_text}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('testTaking.overLast2Weeks')}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[question.question_number]?.toString() || ''}
                onChange={(e) => handleAnswerChange(question.question_number, e.target.value)}
              >
                {test.response_options.map((option) => (
                  <Paper
                    key={option.value}
                    elevation={answers[question.question_number] === option.value ? 3 : 1}
                    sx={{
                      p: 2,
                      mb: 2,
                      cursor: 'pointer',
                      border: answers[question.question_number] === option.value
                        ? '2px solid'
                        : '1px solid',
                      borderColor: answers[question.question_number] === option.value
                        ? 'primary.main'
                        : 'divider',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => handleAnswerChange(question.question_number, option.value)}
                  >
                    <FormControlLabel
                      value={option.value.toString()}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {option.text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Score: {option.value}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>

            {/* Special warning for Question 9 (suicidal ideation) */}
            {question.question_number === 9 && (
              <Alert severity="error" sx={{ mt: 3 }}>
                <AlertTitle>{t('testsPage.crisis.title')}</AlertTitle>
                {t('testResults.crisisWarning.text')}
                <br />
                <strong>{t('testsPage.crisis.lifeline')}</strong>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            startIcon={<ArrowBack />}
          >
            {t('testTaking.previous')}
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          {currentQuestion === test.questions.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered()}
              endIcon={<CheckCircle />}
              color="success"
            >
              {t('testTaking.submit')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered()}
              endIcon={<ArrowForward />}
            >
              {t('testTaking.next')}
            </Button>
          )}
        </Box>

        {/* Summary of answers */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('testTaking.progress')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {test.questions.map((q, index) => (
              <Box
                key={q.question_number}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: answers[q.question_number] !== null
                    ? 'primary.main'
                    : 'action.disabledBackground',
                  color: answers[q.question_number] !== null ? 'white' : 'text.disabled',
                  fontSize: 12,
                  cursor: 'pointer',
                  border: currentQuestion === index ? '2px solid' : 'none',
                  borderColor: 'primary.dark'
                }}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </PageLayout>
  );
};

export default TakeTest;
