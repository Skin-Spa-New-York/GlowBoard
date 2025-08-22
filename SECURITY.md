# Security Guidelines for OnSale Analytics

## Environment Variables

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Development Settings
VITE_NODE_ENV=development
VITE_ENABLE_LOGGING=true
```

### Production Environment Variables

For production deployments, ensure:

1. **Never commit `.env` files** to version control
2. **Use secure environment variable management** (Vercel, Netlify, AWS Secrets Manager, etc.)
3. **Set `VITE_ENABLE_LOGGING=false`** in production
4. **Use Firebase security rules** to restrict database access

## Input Validation

The application implements comprehensive input validation:

### Sales Records

- **Sales Amount**: Must be between $0 and $1,000,000
- **Treatments Count**: Must be between 0 and 1,000
- **Date**: Cannot be more than 1 year in the future
- **Location**: Must be from predefined list
- **Notes**: Limited to 500 characters, sanitized for XSS

### Notes

- **Title**: Required, max 100 characters
- **Content**: Required, max 2,000 characters
- **Priority**: Must be 'low', 'medium', or 'high'

### Text Sanitization

All text inputs are automatically sanitized to prevent:

- Script injection attacks
- Event handler injection
- JavaScript protocol injection

## Authentication & Authorization

### Firebase Authentication

- **Google OAuth only**: Reduces attack surface
- **First user becomes admin**: Automatic admin promotion for initial setup
- **Role-based access control**: Admin vs regular user permissions

### Admin Features

Admin-only features are protected at multiple levels:

- **Frontend route protection**: UI elements hidden for non-admins
- **Backend validation**: Firebase security rules enforce permissions
- **Audit logging**: All admin actions are logged

## Error Handling

### Secure Logging

- **Development**: Full error details logged to console
- **Production**: Errors logged to secure storage, sanitized for sensitive data
- **No sensitive data exposure**: API keys, passwords automatically redacted

### Error Boundaries

- **React Error Boundaries**: Prevent app crashes from component errors
- **Graceful degradation**: User-friendly error messages
- **Error reporting**: Automatic error tracking (ready for Sentry integration)

## Data Protection

### Client-Side Security

- **Input validation**: All user inputs validated and sanitized
- **XSS prevention**: Content Security Policy headers recommended
- **HTTPS only**: All Firebase connections use HTTPS

### Firebase Security Rules

Implement these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null &&
        resource.data.is_admin == true &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.is_admin == true;
    }

    // Sales records - location-based access
    match /salesRecords/{recordId} {
      allow read, write: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.is_admin == true ||
        resource.data.location == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.location
      );
    }

    // Notes - location-based access
    match /notes/{noteId} {
      allow read, write: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.is_admin == true ||
        resource.data.location == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.location
      );
    }

    // Audit logs - admin only
    match /auditLogs/{logId} {
      allow read: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.is_admin == true;
      allow write: if request.auth != null;
    }
  }
}
```

## Deployment Security

### Build Process

- **Console removal**: All console statements removed in production builds
- **Code minification**: Source code obfuscated
- **Source maps**: Only generated for development

### Recommended Headers

Configure these security headers on your hosting platform:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Monitoring & Alerting

### Error Tracking

Ready for integration with:

- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and debugging
- **Firebase Analytics**: User behavior tracking

### Audit Logging

All critical actions are logged:

- User login/logout
- Data creation/modification/deletion
- Admin privilege changes
- Failed authentication attempts

## Security Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] Firebase security rules deployed
- [ ] Console logging disabled in production
- [ ] Input validation tested
- [ ] Error boundaries tested
- [ ] Security headers configured

### Post-Deployment

- [ ] Error tracking configured
- [ ] Audit logs monitored
- [ ] Regular security updates
- [ ] User access reviews
- [ ] Backup procedures tested

## Incident Response

### Security Incident Procedure

1. **Immediate**: Disable affected user accounts
2. **Assessment**: Review audit logs for scope
3. **Containment**: Update Firebase security rules if needed
4. **Recovery**: Restore from backups if necessary
5. **Prevention**: Update validation rules and monitoring

### Contact Information

- **Security Issues**: Report to your security team
- **Firebase Issues**: Contact Firebase support
- **Application Issues**: Check error tracking dashboard

## Regular Security Tasks

### Weekly

- Review audit logs for suspicious activity
- Check error tracking for security-related errors
- Monitor user access patterns

### Monthly

- Update dependencies for security patches
- Review and rotate API keys if needed
- Test backup and recovery procedures

### Quarterly

- Security audit of Firebase rules
- Review user permissions and admin access
- Update security documentation
