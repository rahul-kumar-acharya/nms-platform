# System Architecture Specification

## Overview

The Network Management System (NMS) utilizes a decoupled client-server architecture:
- **Frontend**: Single Page Application (SPA) built with React 18 & Vite, utilizing REST APIs and client-side routing.
- **Backend**: Django 5 API application running Django REST Framework (DRF) with SimpleJWT authentication.
- **Database**: Relational database (PostgreSQL in production, SQLite3 for local development).

```text
                           ┌───────────────────────────────┐
                           │      Client Web Browser       │
                           │   (React 18 + Vite SPA)       │
                           └───────────────┬───────────────┘
                                           │
                                     HTTPS / REST
                                           │
                                           ▼
                           ┌───────────────────────────────┐
                           │      Nginx / Web Server       │
                           └───────────────┬───────────────┘
                                           │
                                           ▼
                           ┌───────────────────────────────┐
                           │   Gunicorn WSGI Application   │
                           │    (Django + DRF Core)        │
                           └───────────────┬───────────────┘
                                           │
                 ┌─────────────────────────┼─────────────────────────┐
                 ▼                         ▼                         ▼
         ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
         │ Accounts &    │         │ Network &     │         │ Income &      │
         │ Authentication│         │ Binary Trees  │         │ Ledger Wallet │
         └───────────────┘         └───────────────┘         └───────────────┘
                 │                         │                         │
                 └─────────────────────────┼─────────────────────────┘
                                           │
                                           ▼
                           ┌───────────────────────────────┐
                           │     PostgreSQL Database       │
                           └───────────────────────────────┘
```

## Core Principles

1. **Backend Financial Authority**: Frontend never performs calculations for wallets, tree placements, or payouts. Backend computes and validates every transaction.
2. **Double-Entry Ledger Security**: Wallet balances are derived from immutable transaction logs.
3. **Role-Based Access Control (RBAC)**:
   - `ADMIN`: Full access to all endpoints, EPIN generation, withdrawal processing, member management, audit logs.
   - `MEMBER`: Access limited to their own profile, downline trees, personal wallet, withdrawal requests, and support tickets.
