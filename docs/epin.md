# EPIN System Architecture & Security

## 1. EPIN Format
EPINs are 16-character alphanumeric uppercase codes with hyphens for readability:
`A3K7-9M2P-NL8Q-7W4Z`

## 2. Generation & Expiry
- Only Admin users can invoke batch EPIN generation.
- Each generated EPIN is permanently bound to a specific `Plan`.
- Optional expiry dates can be attached (`expires_at`).

## 3. Atomic Redemption
When an EPIN is used during registration:
1. Database transaction lock acquired (`select_for_update`).
2. Status checked: MUST be `UNUSED`.
3. Plan activated for newly registered member.
4. EPIN marked `USED`, `used_by` set to new Member, `used_at` set to timestamp.
5. Transaction committed atomically to prevent race conditions or double redemption.
