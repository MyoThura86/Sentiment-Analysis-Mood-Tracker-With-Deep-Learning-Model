// OAuth Configuration
// To get a real Google Client ID:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable Google+ API and Google OAuth2 API
// 4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
// 5. Set authorized origins: http://localhost:5175, http://localhost:5176
// 6. Replace the CLIENT_ID below with your actual client ID

// Safe way to access environment variables in browser
const getEnvVar = (name, defaultValue = '') => {
  try {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      // In development, Vite injects env vars into import.meta.env
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[name] || defaultValue;
      }
      // Fallback for other bundlers that might use process.env
      if (typeof process !== 'undefined' && process.env) {
        return process.env[name] || defaultValue;
      }
    }
    return defaultValue;
  } catch (error) {
    console.warn(`Failed to access environment variable ${name}:`, error);
    return defaultValue;
  }
};

export const OAUTH_CONFIG = {
  // For testing purposes, using a demo client ID
  // Replace with your actual Google Client ID from Google Cloud Console
  GOOGLE_CLIENT_ID: getEnvVar('VITE_GOOGLE_CLIENT_ID', "312345678901-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com"),

  // GitHub OAuth App configuration
  // To get GitHub Client ID:
  // 1. Go to https://github.com/settings/developers
  // 2. Create a new OAuth App
  // 3. Set Authorization callback URL: http://localhost:5175/auth/github/callback
  GITHUB_CLIENT_ID: getEnvVar('VITE_GITHUB_CLIENT_ID', "your_github_client_id_here"),

  // Redirect URLs - safe window access
  REDIRECT_URLS: (() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5175';
      return {
        google: `${origin}/auth/google/callback`,
        github: `${origin}/auth/github/callback`
      };
    } catch (error) {
      // Fallback for SSR or other edge cases
      return {
        google: 'http://localhost:5175/auth/google/callback',
        github: 'http://localhost:5175/auth/github/callback'
      };
    }
  })()
};

// Helper function to check if OAuth is properly configured
export const isOAuthConfigured = {
  google: () => OAUTH_CONFIG.GOOGLE_CLIENT_ID !== "your_google_client_id_here" &&
                OAUTH_CONFIG.GOOGLE_CLIENT_ID !== "312345678901-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com",
  github: () => OAUTH_CONFIG.GITHUB_CLIENT_ID !== "your_github_client_id_here"
};