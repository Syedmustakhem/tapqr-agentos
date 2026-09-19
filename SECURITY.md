# Security Policy

## TapQR AgentOS

TapQR AgentOS is designed as an agentic system that can eventually read business information, reason over business signals, propose changes, execute approved actions, and verify the resulting state.

Because the project can interact with business systems and potentially customer-related information, security is a core architectural requirement.

---

# Supported Versions

During active development, security fixes are applied to the latest development version.

| Version | Supported |
|---|---|
| Latest development version | Yes |
| Older development versions | Best effort |
| Unmaintained versions | No |

---

# Reporting a Vulnerability

Please do not publicly disclose a security vulnerability before it has been reviewed.

If you discover a security issue, report it privately to the project maintainers.

Include:

- A clear description of the vulnerability
- The affected component
- Steps required to reproduce the issue
- Potential security impact
- Relevant logs or screenshots, if safe to share
- A suggested mitigation, if known

Do not include:

- passwords
- API keys
- access tokens
- private customer information
- database credentials
- production secrets

in a public issue or pull request.

---

# Security Issues We Care About

Security reports are especially important for issues involving:

## Authentication

Examples:

- authentication bypass
- invalid token acceptance
- session abuse
- credential exposure

## Authorization

Examples:

- cross-business data access
- privilege escalation
- unauthorized write actions
- OWNER/MANAGER/STAFF boundary violations

## Business Isolation

AgentOS must ensure that data belonging to one business cannot be accessed or modified by another business.

A business identifier must never be treated as sufficient authorization by itself.

---

# Agent Security

AgentOS is an agent-facing system.

This creates additional security considerations beyond ordinary APIs.

The system must distinguish between:

```text
Observation
```

```text
Inference
```

```text
Proposal
```

```text
Approval
```

```text
Execution
```

```text
Verification
```

An agent suggestion must not automatically be treated as authorization to perform a sensitive action.

---

# Approval Boundary

High-impact actions should require explicit approval.

The intended flow is:

```text
Agent
  |
  v
Analyze
  |
  v
Propose
  |
  v
Approval Required
  |
  v
Explicit Approval
  |
  v
Execute
  |
  v
Verify
```

The approval mechanism must not be bypassed by simply invoking the underlying write tool directly.

---

# Input Validation

All externally supplied tool input must be validated before reaching business logic.

AgentOS uses schema validation at the tool boundary.

Invalid input should result in a structured error rather than being passed directly to downstream services.

---

# Secrets

Secrets must never be committed to the repository.

Examples include:

- API keys
- database credentials
- JWT secrets
- OAuth secrets
- WhatsApp credentials
- AWS credentials
- MCP authentication credentials
- third-party service credentials

Use environment variables or an appropriate secret-management system.

The repository `.gitignore` excludes common environment and secret files.

---

# Sensitive Information

Avoid logging:

- passwords
- authentication tokens
- API keys
- database credentials
- private customer information
- unnecessary personal information

Logs should contain only the information required for debugging, auditing, and operational monitoring.

---

# Error Handling

Internal implementation details should not be exposed through public error responses.

AgentOS uses structured error categories such as:

- AUTHENTICATION_FAILED
- AUTHORIZATION_DENIED
- INVALID_INPUT
- RESOURCE_NOT_FOUND
- APPROVAL_REQUIRED
- ACTION_REJECTED
- ACTION_FAILED
- VERIFICATION_FAILED
- UPSTREAM_UNAVAILABLE
- INTERNAL_ERROR

Public errors should provide useful information without exposing secrets, stack traces, credentials, or internal infrastructure details.

---

# Business Authorization

Every business operation must be scoped to an authenticated business context.

The AgentOS principal contains:

```text
userId
businessId
role
```

Current supported business roles include:

```text
OWNER
MANAGER
STAFF
```

Authorization must be evaluated independently from authentication.

---

# Write Operations

Write operations must be treated more carefully than read operations.

Before executing an important write:

```text
Authenticate
    |
    v
Authorize
    |
    v
Validate
    |
    v
Check approval requirement
    |
    v
Execute
    |
    v
Verify
```

The system should not assume that an HTTP success response means that the intended business state has been successfully established.

---

# Verification

Important actions should be verified through a subsequent read operation.

Expected flow:

```text
ACTION
  |
  v
READ BACK
  |
  v
COMPARE
  |
  +---- Expected state ----> VERIFIED
  |
  +---- Different state ---> VERIFICATION_FAILED
```

Verification failures must be visible to the agent and the user.

---

# Dependency Security

Dependencies should be kept reasonably current.

Before releasing significant versions:

- install dependencies from trusted sources
- review dependency changes
- run the project's test suite
- run type checking
- review security advisories where applicable

Do not introduce dependencies without understanding their purpose and security implications.

---

# MCP Security

The MCP server must be treated as an application boundary.

Important considerations include:

- authentication
- authorization
- input validation
- session handling
- transport security
- tool permissions
- error handling
- rate limiting
- audit logging
- approval enforcement

The MCP interface must not become a mechanism for bypassing TapQR authorization.

---

# Production Security

Before production deployment, the project should additionally implement and verify:

- HTTPS
- secure secret management
- authentication
- authorization
- rate limiting
- request validation
- audit logging
- monitoring
- alerting
- safe retries
- idempotency for appropriate write actions
- secure MCP session handling
- dependency security monitoring

These are part of the production-hardening phase of the roadmap.

---

# Responsible Disclosure

Please allow the maintainers reasonable time to investigate and address a vulnerability before public disclosure.

Security reports should be handled privately whenever possible.

---

# Security Philosophy

TapQR AgentOS follows the principle:

> The more power an agent has, the stronger the boundaries around that power must be.

The architecture therefore separates:

```text
READ
  |
  v
REASON
  |
  v
PROPOSE
  |
  v
APPROVE
  |
  v
WRITE
  |
  v
VERIFY
```

Security is considered a continuous architectural requirement rather than a final checklist item.