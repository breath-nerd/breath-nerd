# API Contract

This document defines the agreement between the React frontend and Express backend.

It answers: when the frontend calls a route, what should it send, what should the backend do, and what shape should the response have?

## Scope

The MVP API includes authentication routes only.

MVP routes:

```text
POST /auth/signup
POST /auth/login
POST /auth/logout
GET /auth/verify
```

Future stretch routes:

```text
POST /breathing-sessions
GET /breathing-sessions
GET /breathing-sessions/stats
```

The stretch routes are documented so the team can plan ahead, but they are not required for the first MVP flow.

## General Rules

- All responses should be JSON.
- Auth state is stored in server-side auth sessions.
- The frontend should not receive `password_hash`.
- Protected routes should return `401` JSON when the user is not logged in.
- The backend should use the auth session to identify the current user.
- The frontend should not send `user_id` for protected user-specific data.

## Safe User Object

Successful auth responses should return a safe user object.

```json
{
  "user": {
    "id": "user_uuid",
    "email": "student@example.com",
    "name": "John"
  }
}
```

The user object should not include:

```text
password
password_hash
```

## Error Response Shape

Use a consistent error shape.

```json
{
  "error": "Readable error message"
}
```

Example:

```json
{
  "error": "Invalid email or password"
}
```

## MVP Auth Routes

### `POST /auth/signup`

Purpose: create a new user, hash their password, start an auth session, and return the safe user object.

Request body:

```json
{
  "email": "student@example.com",
  "password": "password123",
  "name": "John"
}
```

Success response:

```json
{
  "user": {
    "id": "user_uuid",
    "email": "student@example.com",
    "name": "John"
  }
}
```

Common error responses:

```text
400 missing required fields
409 email already exists
500 server error
```

Notes:

- Store the password as `password_hash`.
- Do not return the password hash.
- Normalize email casing before saving if the backend chooses to enforce lowercase emails.

### `POST /auth/login`

Purpose: verify an existing user, start an auth session, and return the safe user object.

Request body:

```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

Success response:

```json
{
  "user": {
    "id": "user_uuid",
    "email": "student@example.com",
    "name": "John"
  }
}
```

Common error responses:

```text
400 missing required fields
401 invalid email or password
500 server error
```

Notes:

- Use bcrypt to compare the submitted password against `password_hash`.
- Use the same generic error for wrong email and wrong password.

### `POST /auth/logout`

Purpose: destroy the current auth session.

Request body:

```json
{}
```

Success response:

```json
{
  "message": "Logged out"
}
```

Common error responses:

```text
500 server error
```

Notes:

- Logging out should remove the server-side auth session.
- The frontend should clear its local `user` state after success.

### `GET /auth/verify`

Purpose: check whether the current browser request has a valid auth session.

Request body:

```text
none
```

Success response when logged in:

```json
{
  "user": {
    "id": "user_uuid",
    "email": "student@example.com",
    "name": "John"
  }
}
```

Response when not logged in:

```json
{
  "error": "Not authenticated"
}
```

Status codes:

```text
200 logged in
401 not logged in
500 server error
```

Notes:

- The frontend can call this route when the app loads.
- If the response is `200`, render the protected breathing page.
- If the response is `401`, render the login/signup UI.

## Middleware Contract

### `isAuthenticated`

Purpose: protect backend routes that require a logged-in user.

Behavior:

- If an auth session exists, continue to the route handler.
- If no auth session exists, return `401` JSON.

Unauthenticated response:

```json
{
  "error": "Not authenticated"
}
```

For this React app, backend middleware should return JSON instead of redirecting.

## Future Stretch Routes

These routes are for breathing-session tracking after the MVP works end to end.

Use `breathing-sessions`, not `sessions`, so the route is not confused with auth sessions.

### `POST /breathing-sessions`

Purpose: save a completed breathing exercise for the logged-in user.

Request body:

```json
{
  "mood_before": 7,
  "mood_after": 4,
  "duration_seconds": 120,
  "completed": true
}
```

Success response:

```json
{
  "breathing_session": {
    "id": "breathing_session_uuid",
    "user_id": "user_uuid",
    "mood_before": 7,
    "mood_after": 4,
    "duration_seconds": 120,
    "completed": true,
    "created_at": "2026-05-13T12:00:00.000Z"
  }
}
```

Notes:

- This route should be protected by `isAuthenticated`.
- The backend should get `user_id` from the auth session.
- The frontend should not send `user_id`.

### `GET /breathing-sessions`

Purpose: return breathing-session history for the logged-in user.

Success response:

```json
{
  "breathing_sessions": [
    {
      "id": "breathing_session_uuid",
      "mood_before": 7,
      "mood_after": 4,
      "duration_seconds": 120,
      "completed": true,
      "created_at": "2026-05-13T12:00:00.000Z"
    }
  ]
}
```

Notes:

- This route should be protected by `isAuthenticated`.
- Users should only receive their own breathing-session records.

### `GET /breathing-sessions/stats`

Purpose: return calculated dashboard stats for the logged-in user.

Success response:

```json
{
  "stats": {
    "total_completed": 12,
    "average_mood_before": 7.1,
    "average_mood_after": 4.8,
    "average_mood_change": -2.3,
    "last_session_at": "2026-05-13T12:00:00.000Z"
  }
}
```

Notes:

- This route should be protected by `isAuthenticated`.
- Stats can be calculated from `breathing_sessions`.
- No separate stats table is needed for the first dashboard version.

## Naming Decisions

Use:

```text
POST /auth/signup
GET /auth/verify
POST /breathing-sessions
```

Avoid:

```text
POST /auth/register
GET /auth/me
POST /sessions
```

These choices keep route names consistent and avoid confusion between auth sessions and tracked breathing sessions.
