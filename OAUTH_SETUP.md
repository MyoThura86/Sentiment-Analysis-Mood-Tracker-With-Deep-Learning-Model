# OAuth Setup Guide

This guide will help you configure Google and GitHub OAuth for the Mood Tracker application.

## Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google+ API
   - Google OAuth2 API

### 2. Create OAuth 2.0 Credentials
1. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Set **Application type** to "Web application"
3. Add **Authorized JavaScript origins**:
   - `http://localhost:5175`
   - `http://localhost:5176`
   - `http://localhost:3000` (if using different port)
4. Add **Authorized redirect URIs**:
   - `http://localhost:5175/auth/google/callback`
   - `http://localhost:5176/auth/google/callback`

### 3. Configure Client ID
1. Copy the Client ID from Google Cloud Console
2. Create a `.env` file in the project root:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
   ```
3. Or update `src/config/oauth.js` directly:
   ```javascript
   GOOGLE_CLIENT_ID: "your_actual_google_client_id_here"
   ```

## GitHub OAuth Setup

### 1. Create GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - **Application name**: Mood Tracker
   - **Homepage URL**: `http://localhost:5175`
   - **Authorization callback URL**: `http://localhost:5175/auth/github/callback`

### 2. Configure Credentials
1. Copy the **Client ID** and **Client Secret** from GitHub
2. Update your `.env` file:
   ```env
   VITE_GITHUB_CLIENT_ID=your_github_client_id_here
   ```
3. Update `api/auth_api.py` with your GitHub credentials:
   ```python
   'client_id': 'your_github_client_id_here',
   'client_secret': 'your_github_client_secret_here',
   ```

### 3. Backend Configuration
Update the GitHub OAuth endpoint in `api/auth_api.py`:
```python
# Replace these placeholders with your actual GitHub credentials
'client_id': 'your_github_client_id_here',
'client_secret': 'your_github_client_secret_here',
```

## Testing OAuth Integration

### Current State
- **Google OAuth**: Will show "Google Sign In (Needs Configuration)" button when not configured
- **GitHub OAuth**: Will show error message when credentials are not set up

### After Configuration
1. **Google**: Should show the official Google Sign In button
2. **GitHub**: Should redirect to GitHub authorization page
3. Both should redirect back to the app after successful authentication

## Security Notes

1. **Never commit secrets**: Add `.env` to `.gitignore`
2. **Environment variables**: Use environment variables for production
3. **HTTPS required**: GitHub OAuth requires HTTPS in production
4. **Authorized domains**: Only add trusted domains to OAuth settings

## Troubleshooting

### Google OAuth Issues
- **Error 400**: Check authorized origins and redirect URIs
- **Client ID not working**: Verify the client ID is copied correctly
- **Scope errors**: Ensure proper scopes are requested

### GitHub OAuth Issues
- **Redirect mismatch**: Verify callback URL matches exactly
- **Access denied**: Check if the user has access to the GitHub app
- **Token exchange failure**: Verify client secret is correct

### Common Issues
- **CORS errors**: Ensure backend CORS is configured for your frontend URL
- **Port conflicts**: Make sure frontend and backend are running on correct ports
- **Network issues**: Check if localhost ports are accessible

## Development vs Production

### Development
- Use `localhost` URLs
- Store credentials in `.env` file
- Use HTTP (allowed for localhost)

### Production
- Use your actual domain
- Use environment variables on server
- Require HTTPS for OAuth redirects
- Update OAuth app settings with production URLs