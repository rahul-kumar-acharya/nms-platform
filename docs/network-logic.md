# Network Binary & Referral Logic Specification

## 1. Separation of Concerns

The NMS explicitly decouples three distinct structural fields:
1. **Sponsor**: Who invited/referred the new member (`sponsor_id`). Determines Referral Tree & Direct Payouts.
2. **Parent**: Who is the direct parent node in the Binary Tree (`parent_id`). Determines Placement location.
3. **Position**: Position relative to parent node (`LEFT` or `RIGHT`).

## 2. Binary Placement Rules

- A parent node can have at most **2 direct children**: 1 `LEFT` and 1 `RIGHT`.
- Placement validation steps:
  1. Verify parent node exists in the network.
  2. Verify target position (`LEFT` or `RIGHT`) under parent is strictly empty.
  3. Ensure no cycles or invalid tree loops are introduced.
- Placement authority resides 100% on backend API (`POST /api/v1/network/place/` or registration endpoint).

## 3. Binary Tree Traversal API

Returns nested JSON structure suitable for visual rendering:

```json
{
  "member_id": "M00001",
  "full_name": "Root Admin Member",
  "plan": "Plan A ₹3000",
  "left_count": 12,
  "right_count": 15,
  "left_child": {
    "member_id": "M00002",
    "position": "LEFT",
    "left_child": null,
    "right_child": null
  },
  "right_child": {
    "member_id": "M00003",
    "position": "RIGHT",
    "left_child": null,
    "right_child": null
  }
}
```
