# JENGA TAIFA AI PROGRAM — Security Specification (Phase 0 TDD)

## 1. Core Data Invariants
1. **Default Deny**: All unspecified paths under `/databases/{database}/documents` are denied.
2. **Self-Assigned Role Prevention**: During `/users/{userId}` creation, non-admin users can ONLY register with `roleId == 'beneficiary'`, and can never elevate `roleId` on update.
3. **PII Isolation**: Email and phone live strictly in `/users/{userId}/private/info`, readable/writable only by the verified owner (`request.auth.uid == userId`) or a verified National Admin (`isAdmin()`).
4. **Relational Integrity**: A `/beneficiaries/{beneficiaryId}` record must reference an existing `/saccos/{saccoId}` document on create, and `ownerUid` cannot be forged or mutated.
5. **Immutable Audit Trail**: `/auditLogs/{logId}` entries cannot be updated or deleted by any client.
6. **Temporal Integrity**: `createdAt` and `updatedAt` must strictly equal `request.time`.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated read on `/users/{uid}`**: `auth == null` → Denied.
2. **Unverified email write on `/users/{uid}`**: `email_verified == false` → Denied.
3. **Privilege escalation on user creation**: `roleId: 'national_admin'` by non-admin → Denied.
4. **Self-role elevation on user update**: `affectedKeys` includes `'roleId'` by owner → Denied.
5. **Shadow field injection on user create**: Extra key `'isAdmin': true` → Denied by `keys().hasOnly(...)`.
6. **Cross-user PII read**: Signed-in user A reads `/users/userB/private/info` → Denied.
7. **ID Poisoning**: Document ID > 128 chars or containing invalid symbols (`../`) → Denied by `isValidId()`.
8. **Orphaned Beneficiary creation**: `saccoId: 'nonexistent_sacco'` → Denied by `exists(/saccos/...)`.
9. **Owner UID spoofing on Beneficiary**: `ownerUid: 'someone_else'` → Denied (`ownerUid == request.auth.uid`).
10. **Terminal state bypass**: Updating `/beneficiaries/{id}` when existing `status == 'Completed'` by non-admin → Denied.
11. **Client-forged timestamp**: `createdAt: '2020-01-01'` instead of `request.time` → Denied.
12. **Audit log tampering**: Attempting `update` or `delete` on `/auditLogs/{logId}` → Denied.
