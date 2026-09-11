# Add full name to sign-up

## Changes
- Add a Full name field above Email on Sign Up only, using the existing field styling and a matching user outline icon.
- Validate and trim the name before account creation, with a sensible length limit and translated error feedback.
- Save the full name to the authenticated user profile and existing user database record.
- Return the saved display name after sign-up/login and pass it into the dashboard.
- Show `Hi, [First Name]` on the Home screen by safely extracting the first word from the full name; retain the existing fallback for users without a name.

## Technical details
- Extend the existing Firebase sign-up helper to accept the validated full name, update the authentication profile, and persist `displayName` in the user document.
- Keep login and social sign-in behavior unchanged.
- Verify the sign-up layout at the mobile viewport and confirm the project compiles without errors.
