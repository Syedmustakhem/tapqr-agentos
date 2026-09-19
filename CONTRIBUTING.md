# Contributing to TapQR AgentOS

Thank you for contributing to TapQR AgentOS.

TapQR AgentOS is an agentic growth intelligence project designed to connect AI agents with the TapQR business platform through controlled MCP capabilities.

The project prioritizes:

- clear architecture
- security
- business isolation
- explicit authorization
- controlled agent actions
- verification
- testability
- documentation
- incremental development

---

# Project Philosophy

TapQR AgentOS is not intended to become a collection of disconnected API wrappers.

The long-term architecture is:

```text
OBSERVE
   |
   v
CORRELATE
   |
   v
DETECT
   |
   v
EXPLAIN
   |
   v
PROPOSE
   |
   v
APPROVE
   |
   v
EXECUTE
   |
   v
VERIFY
   |
   v
MEASURE
```

Contributions should strengthen this architecture rather than bypass it.

---

# Before You Start

Before implementing a feature:

1. Read the README.
2. Read the relevant architecture documentation.
3. Check the roadmap.
4. Check the MCP tool design.
5. Check the security requirements.
6. Inspect existing TapQR functionality before creating duplicate logic.
7. Understand the expected authorization boundary.
8. Define how the feature will be tested.
9. Define how the feature will be verified.
10. Update documentation when the architecture changes.

---

# Repository Structure

```text
tapqr-agentos/
|
+-- apps/
|   +-- mcp-server/
|
+-- packages/
|   +-- domain/
|   +-- intelligence/
|   +-- shared/
|
+-- examples/
|   +-- alexa/
|
+-- docs/
|   +-- HANDOFF.md
|   +-- ARCHITECTURE.md
|   +-- ROADMAP.md
|   +-- MCP_TOOLS.md
|   +-- SECURITY.md
|   +-- DEMO.md
|   +-- DECISIONS.md
```

---

# Development Environment

The current MCP server uses:

- Node.js 22+
- npm
- TypeScript
- Express
- MCP SDK
- Zod
- Vitest

Install dependencies:

```powershell
cd apps/mcp-server
npm install
```

---

# Development Commands

From:

```text
apps/mcp-server
```

use:

```powershell
npm run dev
```

for development.

Build:

```powershell
npm run build
```

Type check:

```powershell
npm run typecheck
```

Run tests:

```powershell
npm test
```

Start the built server:

```powershell
npm start
```

---

# Development Workflow

The project follows a sequential roadmap.

The expected workflow is:

```text
Understand
    |
    v
Design
    |
    v
Implement
    |
    v
Test
    |
    v
Verify
    |
    v
Document
    |
    v
Commit
```

Do not skip directly from design to commit.

---

# Roadmap Discipline

The project follows a fixed roadmap.

```text
Phase 0  Foundation
Phase 1  MCP Server Foundation
Phase 2  Read-Only Business Tools
Phase 3  Growth Intelligence
Phase 4  Proposal + Approval
Phase 5  Controlled Writes
Phase 6  Verification
Phase 7  Autonomous Growth Loop
Phase 8  Alexa+ Integration
Phase 9  AWS Integration
Phase 10 Open Source
Phase 11 Production Hardening
Phase 12 Hackathon Demo
Phase 13 Final Submission
```

Features should be implemented in the appropriate phase.

Avoid introducing later-phase complexity prematurely.

---

# Branching

Use feature or phase branches rather than making large changes directly on `main`.

Examples:

```text
phase-2/read-only-tools
feature/business-context
feature/growth-leak-detection
feature/proposal-engine
feature/verification
```

Keep branch names descriptive.

---

# Commits

Use clear commit messages.

Preferred format:

```text
type: short description
```

Examples:

```text
feat: add business context tool
fix: handle missing business context
test: add QR funnel tool tests
docs: update AgentOS architecture
refactor: simplify tool registry
chore: update dependencies
```

Avoid vague messages such as:

```text
update
changes
fix stuff
new code
```

---

# Pull Requests

A pull request should explain:

## What changed

Describe the implementation.

## Why

Explain the problem being solved.

## How

Describe important architectural decisions.

## Testing

Include commands and results.

Example:

```text
npm run typecheck
npm test
npm run build
```

## Security impact

Explain whether the change affects:

- authentication
- authorization
- business isolation
- secrets
- agent permissions
- write operations
- external side effects

## Verification

Explain how the change was verified.

---

# MCP Tool Contributions

New MCP tools should follow the established structure.

A tool should define:

- clear name
- clear description
- explicit input schema
- output contract
- authorization requirements
- side-effect classification
- error behavior
- verification requirements where applicable

---

# Tool Categories

Tools should be classified appropriately.

## READ_ONLY

Retrieves information without modifying state.

Example:

```text
get_business_context
```

## INTELLIGENCE

Analyzes business signals.

Example:

```text
detect_growth_leaks
```

## PROPOSAL

Creates a proposed action without immediately executing it.

Example:

```text
propose_growth_fix
```

## WRITE

Changes business state.

Examples:

```text
create_campaign
update_campaign
create_qr_rule
```

## LIVE_WRITE

Immediate operational actions.

These require stronger safeguards.

## EXTERNAL_SIDE_EFFECT

Actions that affect external systems or people.

These require additional review.

---

# Input Validation

All tool inputs must be validated.

Use Zod schemas at the boundary.

Do not pass unvalidated MCP input directly into:

- database queries
- external APIs
- business logic
- write operations

---

# Authorization

Every business operation must respect business boundaries.

The AgentOS principal contains:

```text
userId
businessId
role
```

Never assume:

```text
businessId == authorization
```

The user's role and permissions must also be considered.

---

# Agent Safety

Do not create a workflow where an agent can silently turn an observation into an irreversible action.

The preferred lifecycle is:

```text
OBSERVE
  |
  v
ANALYZE
  |
  v
PROPOSE
  |
  v
APPROVE
  |
  v
EXECUTE
  |
  v
VERIFY
```

High-impact operations should require explicit approval.

---

# Existing TapQR Integration

AgentOS should use existing TapQR capabilities whenever possible.

Before creating a new business operation:

1. Inspect the existing TapQR backend.
2. Identify the existing route/service/controller.
3. Understand authentication.
4. Understand authorization.
5. Understand request and response formats.
6. Confirm the database behavior.
7. Reuse the existing business logic where appropriate.

Do not invent endpoints.

Do not duplicate business logic without a documented architectural reason.

---

# Testing Requirements

A contribution should include appropriate tests.

At minimum, consider:

- valid input
- invalid input
- missing input
- authorization failure
- resource-not-found behavior
- upstream failure
- successful execution
- verification failure

For write operations, test the complete lifecycle where practical:

```text
validate
   |
authorize
   |
approve
   |
execute
   |
verify
```

---

# Error Handling

Use structured AgentOS errors.

Current categories include:

```text
AUTHENTICATION_FAILED
AUTHORIZATION_DENIED
INVALID_INPUT
RESOURCE_NOT_FOUND
APPROVAL_REQUIRED
ACTION_REJECTED
ACTION_FAILED
VERIFICATION_FAILED
UPSTREAM_UNAVAILABLE
INTERNAL_ERROR
```

Avoid exposing:

- stack traces
- secrets
- credentials
- internal database details
- unnecessary infrastructure information

to external users.

---

# Security

Never commit:

```text
.env
API keys
JWT secrets
database passwords
OAuth secrets
AWS credentials
private keys
access tokens
```

If a secret is accidentally committed:

1. Stop using the secret.
2. Rotate/revoke it.
3. Remove it from the repository history where necessary.
4. Report the incident appropriately.

See:

```text
SECURITY.md
```

for the project security policy.

---

# Documentation

Architecture changes should be documented.

Relevant documentation includes:

```text
README.md
docs/ARCHITECTURE.md
docs/ROADMAP.md
docs/MCP_TOOLS.md
docs/SECURITY.md
docs/HANDOFF.md
docs/DECISIONS.md
```

The handoff document is the primary checkpoint between development phases.

At the end of each phase:

```text
CODE
 +
TEST
 +
VERIFY
 +
DOCUMENT
 +
HANDOFF
 +
COMMIT
```

must be completed.

---

# Phase Completion

A phase is complete only when:

- implementation is finished
- tests pass
- type checking passes
- build passes
- runtime behavior is verified
- documentation is updated
- HANDOFF.md is updated
- changes are committed

---

# Code Quality

Prefer:

- small focused modules
- explicit types
- strict TypeScript
- descriptive names
- deterministic behavior
- clear error handling
- minimal duplication
- testable functions
- documented architectural decisions

Avoid:

- `any` without a strong reason
- hidden global state
- duplicated business logic
- silent failures
- unnecessary dependencies
- speculative abstractions
- large unrelated changes

---

# Dependencies

Before adding a dependency:

1. Confirm it is necessary.
2. Check whether existing dependencies already solve the problem.
3. Understand its purpose.
4. Consider security implications.
5. Keep the dependency scope as small as practical.
6. Update the lockfile.

Do not add dependencies simply because they are popular.

---

# Review Checklist

Before submitting a contribution, verify:

```text
[ ] Feature follows the roadmap
[ ] Architecture documentation is still accurate
[ ] Input validation exists
[ ] Authorization is considered
[ ] Business isolation is preserved
[ ] Errors are structured
[ ] Tests exist
[ ] TypeScript passes
[ ] Build passes
[ ] Runtime behavior was verified
[ ] Security impact was reviewed
[ ] Documentation was updated
[ ] Handoff was updated if the phase changed
[ ] Commit message is descriptive
```

---

# Contribution Principle

The goal is not to add the maximum number of features.

The goal is to build a small number of complete, reliable agent workflows.

A complete feature should move through:

```text
CODE
  |
  v
TEST
  |
  v
VERIFY
  |
  v
DOCUMENT
```

before being considered finished.

---

# Final Principle

TapQR AgentOS is designed around controlled autonomy.

The system should become increasingly capable without becoming increasingly unpredictable.

Therefore:

> Give the agent enough capability to be useful, enough context to reason correctly, enough boundaries to remain safe, and enough verification to prove what actually happened.