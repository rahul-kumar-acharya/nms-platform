# Testing & Quality Assurance Strategy

## 1. Backend Test Suites

Run backend tests using Django test runner:
```bash
cd backend
python manage.py test
```

### Coverage Scope:
- **Authentication**: JWT token login, role verification (`ADMIN` vs `MEMBER`).
- **EPIN Validation**: Unused EPIN redemption, invalid code error handling, expired key rejection.
- **Binary Placement Engine**: Valid placement on empty `LEFT`/`RIGHT` position, prevention of duplicate placement on occupied position.
- **Income Engine**: Direct referral bonus calculation, binary pair matching and daily capping limits.
- **Wallet Ledger**: Immutable balance verification, debit/credit audit logging.

## 2. Frontend Build Verification

Run production build check:
```bash
cd frontend
cmd /c npm run build
```
Ensures zero JSX syntax errors, type resolution bugs, or missing imports.
