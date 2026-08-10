# REST API Endpoints Specification

Base URL: `/api/v1/`

## 1. Authentication (`/api/v1/auth/`)
- `POST /auth/login/`: Username/Password -> Returns JWT `access` & `refresh` tokens + User Role.
- `POST /auth/register/`: Register using EPIN, Sponsor ID, Parent ID & Position.
- `GET  /auth/me/`: Current user profile details.
- `POST /auth/refresh/`: Refresh JWT token.

## 2. Members (`/api/v1/members/`)
- `GET  /members/`: Admin list members (search, filter by status/plan).
- `GET  /members/{id}/`: Detail view.
- `PATCH /members/{id}/`: Update member profile.

## 3. Plans & EPINs (`/api/v1/epins/`)
- `GET  /epins/`: Filter unused/used EPINs.
- `POST /epins/generate/`: Admin generate batch EPINs (`plan_id`, `quantity`).
- `POST /epins/validate/`: Public endpoint to check EPIN validity before registration.

## 4. Network (`/api/v1/network/`)
- `GET /network/binary/`: Member downline binary tree structure.
- `GET /network/referrals/`: Referral tree downline.
- `GET /network/search/`: Search member in tree.

## 5. Income & Wallet (`/api/v1/wallet/`)
- `GET /wallet/`: Current balance & total earnings summary.
- `GET /wallet/transactions/`: Filterable transaction ledger.

## 6. Withdrawals (`/api/v1/withdrawals/`)
- `POST /withdrawals/`: Member submit withdrawal request.
- `GET  /withdrawals/`: List requests.
- `POST /withdrawals/{id}/approve/`: Admin approve payout.
- `POST /withdrawals/{id}/reject/`: Admin reject payout.
