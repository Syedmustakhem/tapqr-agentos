# TapQR AgentOS - Architecture Decisions

## ADR-001 - Use MCP as the Agent Interface

Status:

ACCEPTED

Decision:

TapQR AgentOS will expose its agent-facing capabilities through the Model
Context Protocol.

Reason:

MCP provides a standardized interface for AI clients to discover and invoke
tools.

The AgentOS server therefore becomes an agent-facing orchestration boundary
rather than another conventional REST frontend.

---

# ADR-002 - Use Streamable HTTP

Status:

ACCEPTED

Decision:

Use MCP Streamable HTTP for the remote AgentOS MCP server.

Reason:

The project is intended for remote AI-client integration.

Streamable HTTP is the modern MCP transport intended for remote servers.

The MCP TypeScript SDK documents Streamable HTTP as the recommended
transport for remote servers.

---

# ADR-003 - Use TypeScript

Status:

ACCEPTED

Decision:

Use TypeScript for the MCP server.

Reason:

- Existing TapQR backend uses TypeScript.
- Strong type checking is useful for agent tools.
- Zod integrates naturally with TypeScript.
- MCP SDK provides TypeScript support.
- Shared architectural concepts can remain consistent with TapQR.

---

# ADR-004 - Use Express as the HTTP Host

Status:

ACCEPTED

Decision:

Use Express for the initial MCP HTTP host.

Reason:

- Existing TapQR platform uses Express.
- Team familiarity.
- Straightforward middleware integration.
- Suitable for the current foundation.

The MCP transport remains responsible for MCP protocol handling.

---

# ADR-005 - Keep MCP Transport Separate From Tool Logic

Status:

ACCEPTED

Decision:

MCP HTTP transport must not contain business logic.

Architecture:

HTTP
 |
 v
Transport
 |
 v
McpServer
 |
 v
Tool
 |
 v
Integration/service
 |
 v
TapQR

Reason:

This allows:

- transport changes
- tool testing
- future non-HTTP clients
- clearer security boundaries
- cleaner architecture

---

# ADR-006 - Central Tool Registry

Status:

ACCEPTED

Decision:

All tools are registered through a central registry.

File:

src/tools/registry.ts

Reason:

Avoid scattered registration logic.

The registry provides a predictable extension point for future tool groups.

---

# ADR-007 - AgentOS Must Not Directly Query PostgreSQL

Status:

ACCEPTED

Decision:

AgentOS should use the existing TapQR API for business operations.

Reason:

The existing backend already contains:

- authentication
- authorization
- services
- repositories
- business rules
- validation
- Prisma access

Direct database access would duplicate or bypass those layers.

---

# ADR-008 - Separate Read and Write Tools

Status:

ACCEPTED

Decision:

Read operations and write operations are separate MCP tools.

Reason:

Read operations are lower risk.

Write operations can change business state and therefore require additional
controls.

This separation also makes the agent's behavior easier to understand and
audit.

---

# ADR-009 - Approval Before High-Impact Actions

Status:

ACCEPTED

Decision:

High-impact AgentOS actions require explicit approval.

Examples:

- changing active campaign behavior
- changing customer-facing QR routing
- sending customer communication
- activating experiments

Reason:

The agent should assist with business operations without silently making
important decisions on behalf of the business owner.

---

# ADR-010 - Verification After Writes

Status:

ACCEPTED

Decision:

A successful API response must not automatically be considered proof that
an AgentOS action succeeded.

Future write operations must perform read-back verification.

Concept:

execute
   |
   v
read state
   |
   v
compare expected state
   |
   v
verified / failed

Reason:

This prevents the agent from reporting success when the requested state was
not actually persisted.

---

# ADR-011 - Zod Input Validation

Status:

ACCEPTED

Decision:

Use Zod schemas for tool input validation.

Reason:

LLM-generated arguments must be treated as untrusted input.

Validation must occur before business logic.

---

# ADR-012 - Central AgentOS Error Codes

Status:

ACCEPTED

Decision:

Use AgentOsError with a fixed error-code vocabulary.

Reason:

Stable error codes make it easier for:

- MCP clients
- future Alexa+ integration
- logging
- tests
- UI
- automation
- troubleshooting

to distinguish error categories.

---

# ADR-013 - In-Memory MCP Sessions Initially

Status:

ACCEPTED

Decision:

Use in-memory MCP sessions during the foundation phase.

Reason:

Phase 1 is establishing protocol correctness.

Persistent/distributed session storage is not yet required.

Production scaling will revisit this decision.

---

# ADR-014 - Do Not Build Future Phases Early

Status:

ACCEPTED

Decision:

Implementation follows the fixed roadmap.

Reason:

AgentOS has multiple interacting systems:

MCP
analytics
intelligence
approval
writes
verification
Alexa+
AWS

Building these out of order increases architectural risk.

---

# ADR-015 - Current MCP Protocol Baseline

Status:

ACCEPTED

Current tested protocol:

2025-11-25

The current implementation uses the MCP SDK v1 line and has been verified
against the 2025-11-25 initialization flow.

Any migration to a newer MCP SDK/protocol generation must be treated as an
explicit architectural change rather than an accidental dependency update.