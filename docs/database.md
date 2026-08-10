# Database Schema & Entity Relationships

## Core Models

### `User` (extends `AbstractUser`)
- `id`: UUID / Primary Key
- `username`: String (Unique, default Member ID or Admin handle)
- `email`: String (Unique)
- `role`: Enum (`ADMIN`, `MEMBER`)
- `is_active`: Boolean

### `Member`
- `id`: UUID / Primary Key
- `user`: OneToOne to `User`
- `member_id`: String (Unique index, e.g. `M00001`)
- `full_name`: String
- `mobile`: String
- `sponsor`: ForeignKey to `Member` (Nullable for Root Member)
- `parent`: ForeignKey to `Member` (Nullable for Root Member)
- `position`: String (`LEFT`, `RIGHT`, Nullable for Root)
- `is_root`: Boolean
- `current_plan`: ForeignKey to `Plan`
- `status`: Enum (`ACTIVE`, `INACTIVE`, `BLOCKED`)
- `kyc_status`: Enum (`PENDING`, `VERIFIED`, `REJECTED`)
- `joined_at`: DateTime

### `Plan`
- `id`: Primary Key
- `name`: String (`Plan A`, `Plan B`)
- `price`: Decimal
- `referral_bonus`: Decimal
- `binary_payout`: Decimal
- `daily_capping`: Decimal
- `is_active`: Boolean

### `EPIN`
- `code`: String (Unique index)
- `plan`: ForeignKey to `Plan`
- `status`: Enum (`UNUSED`, `USED`, `REVOKED`)
- `created_by`: ForeignKey to `User`
- `used_by`: ForeignKey to `Member` (Nullable)
- `expires_at`: DateTime (Nullable)
- `used_at`: DateTime (Nullable)

### `Wallet` & `WalletTransaction`
- `Wallet`: `member` (OneToOne), `updated_at`
- `WalletTransaction`:
  - `wallet`: ForeignKey to `Wallet`
  - `type`: Enum (`CREDIT`, `DEBIT`)
  - `category`: Enum (`REFERRAL`, `BINARY`, `WITHDRAWAL`, `BONUS`, `ADJUSTMENT`)
  - `amount`: Decimal
  - `balance_after`: Decimal
  - `reference_id`: String
  - `description`: Text
  - `created_at`: DateTime

### `Withdrawal`
- `id`: Primary Key
- `member`: ForeignKey to `Member`
- `amount`: Decimal
- `status`: Enum (`PENDING`, `APPROVED`, `REJECTED`)
- `payout_details`: JSONField (Bank Name, Account No, IFSC, UPI)
- `admin_notes`: Text
- `processed_at`: DateTime

### `AuditLog`
- `admin_user`: ForeignKey to `User`
- `action`: String
- `target_model`: String
- `target_id`: String
- `ip_address`: String
- `timestamp`: DateTime
