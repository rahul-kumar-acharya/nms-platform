# Double-Entry Ledger Wallet Architecture

## 1. Principles
- **No Direct Mutation**: Wallet balances are never updated via `UPDATE wallet SET balance = balance + 500`.
- **Immutable Log**: Every credit or debit produces an immutable `WalletTransaction` record.
- **Balance Verification**: Current balance is verified against `Sum(CREDIT) - Sum(DEBIT)`.

## 2. Transaction Categories
- `REFERRAL_INCOME`: Direct sponsor reward.
- `BINARY_INCOME`: Pair matching payout.
- `BONUS`: Milestone or achievement reward.
- `WITHDRAWAL_REQUEST`: Pending debit reservation.
- `WITHDRAWAL_REFUND`: Restores funds if withdrawal is rejected by admin.
- `SYSTEM_ADJUSTMENT`: Manual admin balance audit correction with mandatory reason log.
