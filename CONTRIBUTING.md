# NMS Contribution Guidelines

Welcome to the **Network Management System (NMS)** repository! This project is maintained by a 3-member development team using Git workflow best practices.

---

## 1. Branch Strategy

We follow a structured branch convention:

- `main` — Production-ready code. Protected branch.
- `develop` — Staging & integration branch.
- `feature/<feature-name>` — Feature branches for individual tasks. Example: `feature/epins-engine`, `feature/binary-tree-ui`.
- `fix/<bug-description>` — Bug fix branches.

---

## 2. Development Workflow

1. **Pull Latest Changes**: Ensure your `develop` branch is up to date before creating a new branch.
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. **Create Feature Branch**:
   ```bash
   git checkout -b feature/auth-jwt
   ```
3. **Commit Convention**:
   Use semantic commit messages:
   - `feat: add EPIN batch generation endpoint`
   - `fix: correct left/right binary pair matching logic`
   - `docs: update income calculation rules`
   - `refactor: optimize binary tree rendering component`
   - `test: add unit tests for wallet ledger transactions`
4. **Open Pull Request (PR)**:
   - Target `develop` branch.
   - Attach screenshots or API sample requests/responses.
   - Require code review approval from at least 1 team member before merging.

---

## 3. Financial Logic Rule

> **CRITICAL**: Frontend client inputs must NEVER decide financial payouts, member balances, or binary tree placements. All financial calculations, binary pair evaluations, and EPIN redemptions MUST be executed securely on the Django backend.

---

## 4. Environment Variables

Never commit `.env` files to Git. Update `.env.example` whenever adding new environment variable dependencies.
