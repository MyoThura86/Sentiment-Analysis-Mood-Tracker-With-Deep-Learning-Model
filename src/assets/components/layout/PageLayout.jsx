import React from 'react';
import { Box, Container, Fade } from '@mui/material';
import NavigationBar from './NavigationBar';

const PageLayout = ({ children, user, onSignOut, maxWidth = "lg", fullWidth = false, journalEntries = [] }) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <NavigationBar user={user} onSignOut={onSignOut} journalEntries={journalEntries} />

      <Fade in timeout={800}>
        <Box sx={{ pt: 2 }}>
          {fullWidth ? (
            <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
              {children}
            </Box>
          ) : (
            <Container maxWidth={maxWidth} sx={{ py: 2 }}>
              {children}
            </Container>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default PageLayout;