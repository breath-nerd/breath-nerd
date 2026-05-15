# Database Schema

This document describes the durable database shape for Breathe Nerd.

The MVP needs authentication data and a database prepared for future breathing-session tracking, including future mood ratings and dashboard stats. The MVP does not require collecting mood ratings, saving completed breathing exercises, rendering dashboard stats, or showing breathing-session history yet.

## Naming Rules

- Use lowercase table and column names.
- Use `snake_case` for multi-word names.
- Use plural table names.
- Use `auth sessions` when talking about login state.
- Use `breathing_sessions` when talking about completed breathing exercises.
- Avoid naming the breathing exercise table `sessions`; that is too easy to confuse with auth sessions.

## Core Relationship

One user can have zero or many breathing sessions.

A new user starts with zero breathing sessions. A returning user may eventually have many breathing sessions once stretch tracking is implemented.

```text
users 1 ---- many breathing_sessions
```

## MVP Table: `users`

The `users` table stores application accounts.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | UUID | Yes | Primary key. Unique identifier for each user. |
| `email` | Text | Yes | Login email. Should be unique. |
| `password_hash` | Text | Yes | Hashed password from bcrypt. Never store a plain text password. |
| `name` | Text | Yes | Display name for greetings like "welcome back". |
| `created_at` | Timestamp | Yes | Timestamp for when the user signed up. |

Recommended constraints:

- `id` should be the primary key.
- `email` should be unique.
- `email` should be stored consistently, usually lowercase.
- `password_hash` should never be returned to the frontend.

Example shape:

```text
users
- id
- email
- password_hash
- name
- created_at
```

## Future Stretch Table: `breathing_sessions`

The `breathing_sessions` table is for future stretch tracking after the MVP works end to end.

It stores completed breathing exercises, not login sessions.

| Column | Type | MVP Status | Notes |
| --- | --- | --- | --- |
| `id` | UUID | Prepared | Primary key. Unique identifier for each breathing-session record. |
| `user_id` | UUID | Prepared | Foreign key to `users.id`. Identifies which user completed the breathing exercise. |
| `mood_before` | Integer | Prepared | Future 1-10 stress rating before the exercise. Not collected in the MVP. |
| `mood_after` | Integer | Prepared | Future 1-10 stress rating after the exercise. Not collected in the MVP. |
| `duration_seconds` | Integer | Prepared | Future duration of the breathing exercise in seconds. |
| `completed` | Boolean | Prepared | Future flag for whether the user finished the full breathing flow. |
| `created_at` | Timestamp | Prepared | Timestamp for when the breathing exercise happened. |

Recommended constraints:

- `user_id` should reference `users.id`.
- Deleting a user should also remove that user's breathing sessions.
- `mood_before` should be between 1 and 10 when present.
- `mood_after` should be between 1 and 10 when present.
- `duration_seconds` should be greater than 0 when present.
- The server should set `user_id` from the auth session, not from the frontend request body.

Example shape:

```text
breathing_sessions
- id
- user_id
- mood_before
- mood_after
- duration_seconds
- completed
- created_at
```

## SQL

### users table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
```

### breathing_sessions table
```sql
CREATE TABLE breathing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  mood_before INT NOT NULL,
  mood_after INT NOT NULL,
  duration_seconds INT NOT NULL,
  completed BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Auth Sessions vs. Breathing Sessions

These are different concepts.

Auth sessions:

- Track whether a user is logged in.
- Are created on login or signup.
- Are destroyed on logout.
- Power protected routes.
- Should not store breathing exercise history.

Breathing sessions:

- Represent completed breathing exercises.
- Belong to a user through `user_id`.
- Are used later for dashboard history and stats.
- Are stretch-feature data, not required for the first MVP flow.

## Future Dashboard Data

The database should be shaped so future dashboard stats can be calculated from breathing-session records.

When dashboard work begins, the app may calculate:

- Total breathing exercises completed.
- Average mood before.
- Average mood after.
- Average mood change.
- Most recent breathing session.

These values can be calculated from `breathing_sessions`; they do not need separate tables for the first version of the dashboard. The MVP can prepare the schema for these calculations without building the dashboard UI or stats endpoints yet.

## Security Rules

- Never store plain text passwords.
- Never send `password_hash` to the client.
- Never trust a `user_id` sent from the frontend for protected data.
- Use the logged-in auth session to decide which user's data can be read or written.
- Users should only be able to read their own breathing-session records.

## MVP vs. Stretch Summary

| Area | MVP | Stretch |
| --- | --- | --- |
| `users` table | Required | Continue using |
| Auth sessions | Required | Continue using |
| `breathing_sessions` table | Prepared for future use | Actively used |
| Mood ratings | Prepared for future use | Collected and saved |
| Dashboard stats | Supported by schema | Calculated from breathing sessions |
