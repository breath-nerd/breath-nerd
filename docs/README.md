# Docs

This directory contains durable supporting documents for Breath Nerd.

Use these files for project structure, direction, boundaries, and shared decisions that should remain useful over time. Active task tracking belongs in `TODO.md`, contribution workflow belongs in `CONTRIBUTING.md`, and the main project overview belongs in the root `README.md`.

## Current Docs

| File | Purpose | Status |
| --- | --- | --- |
| `roadmap.md` | Defines the MVP and stretch-feature stages for the project. | Active |
| `architecture.md` | Defines the project scaffold, frontend/backend responsibilities, data flow, API naming, and MVP vs. stretch boundaries. | Active |
| `API_CONTRACT.md` | Defines MVP auth routes, request/response shapes, middleware behavior, and future breathing-session API targets. | Active |
| `DATABASE_SCHEMA.md` | Defines the user schema, future breathing-session schema, and auth session vs. breathing session distinction. | Active |
| `FEATURE_OWNERSHIP.md` | Intended place for stable ownership boundaries if the team needs more detail than the root README. | Placeholder |

## Documentation Rules

- Keep docs durable and useful for future collaborators.
- Do not duplicate temporary task lists here.
- Do not update these files for every small code change.
- Prefer a short, accurate document over a long document that will go stale.
- Create or fill a doc only when it clarifies a real project boundary or decision.

## Where Things Belong

- Use `TODO.md` for the active task list.
- Use `CONTRIBUTING.md` for commits, pull requests, comments, and workflow rules.
- Use `README.md` for project overview, MVP scope, stack, and setup direction.
- Use `PROJECT_BRIEF.md` for problem, solution, MVP, stretch features, and success criteria.
- Use `AGENTS.md` for AI assistant behavior in this student repository.
