# Breathe Nerd

Breathe Nerd is a low-friction breathing exercise web app for developers and people who work at computers. The goal is simple: open the app, breathe for a short guided exercise, and get back to work.

## Problem

Developers and computer-based workers often spend hours in high-stress, high-focus states without intentional recovery. When breaks do happen, they are often passive activities like scrolling or watching videos, which may not actually reset the nervous system.

Most wellness apps are too generic, too complicated, or require too much commitment to use in the middle of a work session. Breathe Nerd is designed for the specific moment when someone needs a short, structured reset without losing momentum.

## Solution

Breathe Nerd guides users through a short breathing exercise designed to help reset their nervous system during a work session.

The MVP focuses on authentication, protected routes, one guided breathing exercise, and a database prepared for future breathing-session tracking. Later stretch features can add mood check-ins, saved breathing-session history, and a personal dashboard.

## MVP Definition

The MVP is the smallest complete version of the app that proves the core idea: a logged-in user can access and complete one guided breathing exercise.

For this project, the MVP includes:

- User authentication with signup, login, logout, bcrypt password hashing, server-side auth sessions, and protected routes.
- A home or exercise page with one guided breathing technique, a timer, and a clean calming interface.
- A database prepared for future breathing-session tracking without building the full dashboard yet.

## Stretch Features

Stretch features are optional improvements that should only be started after the MVP works end to end.

- Mood check-in where users rate stress from 1 to 10 before and after the exercise.
- Breathing-session saving to the database with user ID, timestamp, mood before, mood after, and duration.
- A personal dashboard showing breathing-session history, total breathing exercises completed, and average mood before vs. after.
- Chrome extension reminders that prompt users to take a breathing break at set intervals.
- Live breathing room showing how many other people are currently doing a breathing exercise.
- Multiple breathing exercises such as box breathing, 4-7-8 breathing, and physiological sigh.
- Streak tracking to encourage a consistent daily break habit.
- Pomodoro integration that pairs focused work blocks with breathing exercises.
- Advanced mood analytics showing trends over time, best days of the week, and long-term improvement.

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | React, TypeScript, CSS |
| Backend | Node.js, Express |
| Authentication | bcrypt, server-side auth sessions |
| Database | Supabase PostgreSQL |
| Testing/API tools | Postman / Yaak |
| Version control | Git, GitHub |

## Team

| Area | Owners | Focus |
| --- | --- | --- |
| Frontend | John, Kanami | Breathing UI, exercise flow, frontend routes |
| Backend | Maia, Adel | Auth routes, protected routes, Supabase setup, future breathing-session schema |

## MVP API Targets

The frontend and backend should agree on route names before building too far.

```text
POST /auth/signup
POST /auth/login
POST /auth/logout
GET /auth/verify
```

## Future Breathing-Session API Targets

These routes are stretch targets for tracking completed breathing exercises. They should not be confused with auth sessions.

```text
POST /breathing-sessions
GET /breathing-sessions
GET /breathing-sessions/stats
```

## Future Breathing-Session Data Model

Each completed breathing session could store:

```text
user_id
created_at
mood_before
mood_after
duration
```

## Repo Layout

```text
breathe-nerd/
|-- client/      # React + TypeScript frontend
|-- server/      # Node + Express backend
|-- docs/        # Planning docs and feature notes
|-- README.md
`-- PROJECT_BRIEF.md
```

## Development Workflow

1. Create a branch from `main` before starting a feature.
2. Build only the feature or task assigned to that branch.
3. Test the change locally or with Postman when applicable.
4. Push the branch to GitHub.
5. Open a pull request into `main`.
6. Request review from someone working on the related frontend or backend area.

## Project Milestones

1. Authentication works: users can sign up, log in, and log out.
2. Protected routes work: logged-in pages are blocked from unauthenticated users.
3. Breathing flow works without database saving.
4. Database is prepared for future breathing-session tracking.
5. UI is polished and edge cases are handled.
6. Stretch work starts after the MVP: mood check-in, breathing-session saving, and dashboard.
