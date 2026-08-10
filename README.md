# Network Management System (NMS)

A enterprise-grade member and binary network management platform featuring a **React + Vite** frontend, **Django + Django REST Framework** backend, ledger-based double-entry wallet system, EPIN registration, automated binary/referral income engine, KYC verification workflow, and real-time interactive binary tree visualization.

---

## Architecture Overview

```text
                               ┌─────────────────────────────┐
                               │    MEMBER & ADMIN PORTAL    │
                               │      React + Vite SPA       │
                               └──────────────┬──────────────┘
                                              │
                                           REST API (JWT)
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │       DJANGO BACKEND        │
                               │     Django REST Framework   │
                               └──────────────┬──────────────┘
                                              │
                ┌─────────────────────────────┼─────────────────────────────┐
                │                             │                             │
                ▼                             ▼                             ▼
        PostgreSQL / SQLite            Business Logic                 JWT Auth & RBAC
     (Ledger, Trees, EPINs)      (Binary Engine, Income, Wallet)   (Admin vs Member Roles)
```

---

## Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Custom SVG Binary Visualizer, Axios, Zustand State Management
- **Backend**: Python 3.13, Django 5, Django REST Framework, SimpleJWT, CORS Headers
- **Database**: PostgreSQL (Production) / SQLite3 (Development)
- **Documentation**: Comprehensive Markdown docs inside `/docs`

---

## Subsystem Architecture

| Subsystem | Responsibilities |
|---|---|
| `accounts` | JWT authentication, user roles (`ADMIN`, `MEMBER`), access permissions |
| `members` | Member profile, Sponsor FK, Parent FK, Position (`LEFT`/`RIGHT`), Status |
| `plans` | Membership plans (Plan A ₹3000, Plan B ₹2800), daily capping, referral/binary rates |
| `epins` | Cryptographic registration key generation, batch export, redemption validation |
| `network` | Binary tree placement algorithm, referral structure APIs, tree node data |
| `income` | Rules Engine: Referral commission, Binary pair matching (1:1 / 2:1), Carry Forward |
| `wallet` | Immutable double-entry ledger (`Wallet`, `WalletTransaction`) |
| `withdrawals` | Payout requests, minimum threshold check, KYC check, Admin approval workflow |
| `kyc` | Document upload, ID verification, approval/rejection audit |
| `reports` | Member growth, revenue metrics, pair counts, payout summaries |
| `audit` | Comprehensive Admin action tracking logs |

---

## Quick Start (Development)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements/development.txt
python manage.py migrate
python manage.py seed_data   # Seeds Root Admin, Root Member M00001, Plans & EPINs
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173` and connect to the backend at `http://localhost:8000/api/v1`.

---

## Documentation Suite

Detailed system documentation is located in the [`docs/`](./docs) directory:
- [`docs/income-rules.md`](./docs/income-rules.md) — Single Source of Truth for Plan rules & Income engine.
- [`docs/architecture.md`](./docs/architecture.md) — High-level architecture & security model.
- [`docs/database.md`](./docs/database.md) — Entity-Relationship models and database schemas.
- [`docs/api.md`](./docs/api.md) — REST API endpoint documentation.
- [`docs/network-logic.md`](./docs/network-logic.md) — Placement engine & tree traversal algorithms.
- [`docs/epin.md`](./docs/epin.md) — EPIN lifecycle & security.
- [`docs/wallet.md`](./docs/wallet.md) — Double-entry ledger architecture.
- [`docs/deployment.md`](./docs/deployment.md) — Production deployment blueprint.
- [`docs/testing.md`](./docs/testing.md) — Automated testing strategy.

---

## License

This project is licensed under the [MIT License](./LICENSE).
