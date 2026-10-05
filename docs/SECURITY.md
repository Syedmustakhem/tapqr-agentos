# TapQR AgentOS - Security Architecture

## Status

Phase 1

---

# 1. SECURITY OBJECTIVE

AgentOS is an AI-facing system.

Therefore the system must assume:

- model-generated input can be incorrect
- model-generated input can be malicious
- tool arguments are untrusted
- external clients are untrusted until authenticated
- upstream APIs can fail
- successful HTTP responses do not automatically prove correct state

---

# 2. SECURITY PRINCIPLES

1. Least privilege.

2. Explicit business context.

3. Input validation.

4. No secret exposure.

5. No direct database access from agent tools.

6. Read and write separation.

7. Approval before high-impact actions.

8. Verification after writes.

9. Controlled error responses.

10. Auditability.

---

# 3. CURRENT AUTHENTICATION BOUNDARY

AgentOS currently defines:

AuthenticatedPrincipal

Fields:

userId
businessId
role

Roles:

OWNER
MANAGER
STAFF

This is currently an architectural abstraction.

The final production MCP authentication mechanism is not yet implemented.

---

# 4. BUSINESS ISOLATION

Every business operation must have an explicit business context.

AgentOS must not trust:

businessId supplied by an LLM

as proof of authorization.

Correct:

authenticated identity
       |
       v
authorized business
       |
       v
business operation

---

# 5. INPUT VALIDATION

All tool inputs must be validated.

Zod is the current validation mechanism.

Unvalidated input must not be sent to:

- TapQR APIs
- database layers
- external services
- write operations

---

# 6. SECRETS

Never commit:

- JWTs
- access tokens
- refresh tokens
- API keys
- database URLs containing credentials
- WhatsApp credentials
- AWS credentials
- MCP authentication secrets

Secrets must be provided through environment variables or a production
secret-management system.

---

# 7. ERROR HANDLING

Errors should not expose:

- database credentials
- access tokens
- stack traces to external clients
- internal filesystem paths
- SQL statements
- private provider responses

Internal diagnostic details may be logged securely.

External clients should receive controlled AgentOS error messages.

---

# 8. MCP SECURITY

The MCP endpoint is an agent-facing interface.

Before production deployment, it requires:

- authentication
- authorization
- origin/host protections where applicable
- rate limiting
- request validation
- secure TLS termination
- structured logging
- abuse monitoring

---

# 9. LOCAL SERVER SECURITY

Current local server:

127.0.0.1:3000

This limits the initial development server to localhost.

The server must not be exposed publicly for production use without the
required authentication and security controls.

---

# 10. SESSION SECURITY

Current MCP sessions are stored in memory.

Session IDs are generated using cryptographically secure random UUIDs.

Production deployment must evaluate:

- session lifetime
- expiration
- revocation
- distributed session handling
- load balancing
- session affinity or shared state
- abuse prevention

---

# 11. WRITE SECURITY

No AgentOS write operation currently exists.

Future write operations must include:

authorization
+
validation
+
impact classification
+
approval policy
+
idempotency
+
execution
+
verification
+
audit logging

---

# 12. APPROVAL SECURITY

Approval must be explicit.

The system must not treat:

"maybe"
"probably"
"do it"
"looks good"

as equivalent to a validated high-impact approval unless the approval
protocol explicitly defines it as such.

The final approval mechanism will be designed in the proposal/approval
phase.

---

# 13. VERIFICATION SECURITY

A tool must not report:

"Action successful"

only because the upstream API returned HTTP 200.

Future write flow:

REQUEST
   |
   v
VALIDATE
   |
   v
AUTHORIZE
   |
   v
APPROVE
   |
   v
EXECUTE
   |
   v
READ BACK
   |
   v
COMPARE
   |
   +---- mismatch ---> VERIFICATION_FAILED
   |
   v
VERIFIED

---

# 14. PII

AgentOS should minimize exposure of personal information.

Future analytics tools should return only the information necessary for the
agent's task.

Raw:

phone numbers
emails
IP addresses
full customer records

should not be exposed unless required and authorized.

Aggregated metrics are preferred for intelligence.

---

# 15. LOGGING

Logs must not contain secrets.

Avoid logging:

Authorization headers
Bearer tokens
passwords
OTP values
provider credentials

Logs should contain safe operational information such as:

request ID
tool name
operation
business context identifier where safe
duration
success/failure
error code

---

# 16. DEPENDENCY SECURITY

Dependencies must be reviewed before introduction.

Do not add packages merely for convenience.

Current primary security-relevant dependencies include:

MCP SDK
Express
Zod

---

# 17. SECURITY CHECKPOINT

Phase 1:

MCP protocol:

VERIFIED

Local binding:

127.0.0.1

Input validation:

IMPLEMENTED

Error vocabulary:

IMPLEMENTED

Production authentication:

NOT YET IMPLEMENTED

Production authorization:

NOT YET IMPLEMENTED

Rate limiting:

NOT YET IMPLEMENTED

Distributed session security:

NOT YET IMPLEMENTED

These remaining items belong to later production-hardening phases.