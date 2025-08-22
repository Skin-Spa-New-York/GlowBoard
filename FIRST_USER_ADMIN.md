# First User Admin Setup

This document explains how the automatic first user admin system works in OnSale.

## How It Works

The OnSale application automatically makes the first user to sign up an administrator. This ensures there's always at least one admin who can manage other users and system settings.

### Automatic Admin Assignment

1. **First User Detection**: When a user signs up (either through login or authentication), the system checks if any users exist in the database.

2. **Admin Assignment**: If no users exist, the new user is automatically assigned `is_admin: true`.

3. **Subsequent Users**: All users after the first are created as regular users with `is_admin: false`.

### Implementation Details

The logic is implemented in the `UserFirebaseService` class in `src/services/firebase.ts`:

- `isFirstUser()` method checks if the users collection is empty
- Both `login()` and `me()` methods use this check when creating new users
- The first user gets `is_admin: true`, others get `is_admin: false`

### Manual Admin Promotion

For development or emergency situations, you can manually promote users to admin:

#### Method 1: Development Utils Page

- Navigate to `/dev-utils` (only available in development mode or to existing admins)
- Use the "Promote User to Admin" form
- Enter the email address of the user to promote

#### Method 2: User Management (Admin Only)

- Existing admins can promote users through the User Management page
- This is the standard way to manage user permissions

#### Method 3: Direct Service Call (Development)

```typescript
import { UserEntity } from "@/services/entities";

// Promote a user by email
await UserEntity.promoteToAdmin("user@example.com");
```

## Security Considerations

- Only the first user is automatically made admin
- Manual promotion requires existing admin privileges (except in development)
- The system defaults to non-admin for security if user count check fails
- All admin promotions are logged in the audit system

## Testing

To test the first user admin functionality:

1. Clear the users collection in Firebase
2. Sign up with a new user
3. Verify the user has `is_admin: true`
4. Sign up with a second user
5. Verify the second user has `is_admin: false`

## Troubleshooting

If you need to reset the admin system:

1. **Development**: Use the DevUtils page at `/dev-utils`
2. **Production**: Use Firebase console to manually update user documents
3. **Emergency**: Contact system administrator

## Files Modified

- `src/services/firebase.ts` - Added first user detection logic
- `src/components/Utils/AdminSetup.tsx` - Manual admin promotion component
- `src/pages/DevUtils.tsx` - Development utilities page
- `src/App.tsx` - Added DevUtils route
