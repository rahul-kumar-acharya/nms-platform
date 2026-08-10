# Source of Truth: Income & Business Rules Specification

This document serves as the official specification for all plans, referral bonuses, binary pair calculations, wallet credits, and withdrawal conditions within the Network Management System.

---

## 1. Plans Overview

The system supports configurable membership plans. Initial default plans:

### Plan A (Standard Plan)
- **Activation Price**: ₹3,000
- **Direct Referral Commission**: ₹500 per direct referral
- **Binary Pair Payout**: ₹1,000 per matched pair (1 Left : 1 Right)
- **Daily Binary Capping**: ₹10,000 (Max 10 pairs / day)
- **Pair Matching Ratio**: 1:1 (after initial 2:1 or 1:2 qualification pair if enabled)

### Plan B (Premium Plan)
- **Activation Price**: ₹2,800
- **Direct Referral Commission**: ₹400 per direct referral
- **Binary Pair Payout**: ₹800 per matched pair (1 Left : 1 Right)
- **Daily Binary Capping**: ₹8,000 (Max 10 pairs / day)
- **Pair Matching Ratio**: 1:1

---

## 2. Income Types & Calculation Logic

### A. Direct Referral Income
- **Trigger**: When Member X registers or activates a plan using an EPIN and specifies Member Y as Sponsor ID (`sponsor`).
- **Calculation**: Fixed referral amount defined by the activated plan.
- **Credit Action**: Immediately creates an `IncomeTransaction` (type `REFERRAL`) and credits Sponsor Y's `Wallet`.

### B. Binary Pair Income
- **Trigger**: Batch / real-time income engine evaluation of left and right network volumes.
- **Volume Tracking**:
  - Each active member under Left subtree contributes 1 Left Unit.
  - Each active member under Right subtree contributes 1 Right Unit.
- **Pair Evaluation**:
  - `Matched Pairs = min(Left New Volume, Right New Volume)`
  - `Left Carry Forward = Left Volume - Matched Pairs`
  - `Right Carry Forward = Right Volume - Matched Pairs`
- **Capping Constraint**:
  - Payout for the current evaluation cycle is capped at `Plan.daily_capping`. Excess pairs in that window are flushed or capped per rules.

---

## 3. Milestones & Bonuses

- **50 Pair Achievement**: Reaching 50 cumulative pairs qualifies the member for a Special Milestone Bonus (e.g. ₹6,000 bonus reward).
- **₹30,000 & ₹60,000 Cumulative Milestones**: Additional rank advancements and bonus payouts recorded as `BONUS` category income transactions.

---

## 4. Wallet & Withdrawal Rules

- **Ledger Model**: Wallets are immutable double-entry logs. Current balance = `Sum(CREDIT) - Sum(DEBIT)`.
- **Minimum Withdrawal**: ₹500
- **Prerequisites for Withdrawal**:
  1. Member `kyc_status` MUST be `VERIFIED`.
  2. Member must have active plan status (`status == ACTIVE`).
  3. Available balance must be >= withdrawal amount requested.
- **Admin Processing**:
  - When approved, transaction changes from `PENDING` -> `APPROVED` -> `COMPLETED` and debits the wallet balance.
  - When rejected, funds are released back to available balance with admin notes.
