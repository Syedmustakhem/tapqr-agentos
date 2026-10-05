# TapQR AgentOS - Engineering Handoff

## Document Status

Project: TapQR AgentOS
Phase: Phase 1 - MCP Server Foundation
Status: COMPLETE
Last Updated: 2026-09-19

This document is the authoritative engineering handoff for the current
TapQR AgentOS implementation.

The project must continue according to the approved roadmap.

Do not skip phases.

Do not implement future-phase functionality early unless explicitly approved.

---

# 1. PROJECT PURPOSE

TapQR AgentOS is an autonomous growth intelligence layer for the existing
TapQR platform.

The system is designed to eventually allow an AI agent such as Alexa+ to:

1. Observe business signals.
2. Correlate QR, campaign, lead, and conversion data.
3. Detect measurable customer journey problems.
4. Explain the evidence.
5. Propose a possible improvement.
6. Request approval when an action has meaningful impact.
7. Execute an approved action through TapQR.
8. Verify that the action actually persisted.
9. Measure the resulting outcome.

Core concept:

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

The project is intentionally designed to be more than a basic MCP wrapper
around an existing API.

---

# 2. CURRENT PHASE

Phase 1 - MCP Server Foundation

Status:

    COMPLETE

Phase 1 established the technical foundation required for the later
AgentOS intelligence and Alexa+ integration.

---

# 3. PHASE 1 OBJECTIVES

The following objectives were completed:

- Repository foundation.
- MCP server package.
- TypeScript configuration.
- Node.js runtime configuration.
- MCP SDK integration.
- Express HTTP host.
- Streamable HTTP MCP transport.
- MCP initialization.
- Stateful MCP session handling.
- MCP tool registration.
- Tool input validation.
- AgentOS error architecture.
- Initial authentication/principal boundary.
- Health endpoint.
- Initial system status tool.
- MCP protocol verification.

---

# 4. RUNTIME STACK

Current runtime:

Node.js 22.x

Verified development runtime:

Node.js v22.20.0

npm:

10.9.3

Language:

TypeScript

Package type:

ESM

MCP SDK:

@modelcontextprotocol/sdk 1.30.0

HTTP framework:

Express

Validation:

Zod 4.6.5

Development runtime:

tsx 4.23.13

Testing framework:

Vitest 5.0.1

TypeScript:

7.0.2

---

# 5. REPOSITORY STRUCTURE

Current AgentOS repository:

tapqr-agentos/
|
+-- README.md
+-- LICENSE
+-- CONTRIBUTING.md
+-- SECURITY.md
+-- .gitignore
+-- .env.example
|
+-- apps/
|   |
|   +-- mcp-server/
|
+-- packages/
|   |
|   +-- domain/
|   +-- intelligence/
|   +-- shared/
|
+-- examples/
|   |
|   +-- alexa/
|
+-- docs/
    |
    +-- HANDOFF.md
    +-- ARCHITECTURE.md
    +-- ROADMAP.md
    +-- MCP_TOOLS.md
    +-- SECURITY.md
    +-- DEMO.md
    +-- DECISIONS.md

Only the MCP server foundation has been implemented so far.

The domain and intelligence packages are reserved for later phases.

---

# 6. MCP SERVER PACKAGE

Location:

apps/mcp-server/

Package:

@tapqr/agentos-mcp-server

Current package version:

0.1.0

Important scripts:

npm run dev

npm run build

npm start

npm run typecheck

npm test

npm run test:watch

---

# 7. CURRENT MCP SERVER COMPONENTS

Current important files:

apps/mcp-server/
|
+-- package.json
+-- tsconfig.json
|
+-- src/
    |
    +-- app.ts
    +-- server.ts
    |
    +-- transport/
    |   +-- http.ts
    |
    +-- tools/
    |   +-- registry.ts
    |   |
    |   +-- system/
    |       +-- status.ts
    |       +-- schemas.ts
    |
    +-- errors/
    |   +-- agentos-error.ts
    |   +-- error-response.ts
    |
    +-- auth/
        +-- principal.ts

---

# 8. MCP SERVER IDENTITY

Server name:

tapqr-agentos

Current version:

0.1.0

Current capability:

tools

Current implementation stage:

mcp-foundation

---

# 9. HTTP SERVER

Default local host:

127.0.0.1

Default port:

3000

MCP endpoint:

/mcp

Health endpoint:

/health

Example:

http://127.0.0.1:3000/mcp

---

# 10. MCP TRANSPORT

The server uses:

Streamable HTTP

The current implementation uses:

StreamableHTTPServerTransport

The transport is stateful.

Each initialized MCP connection receives a generated session ID.

Sessions are currently stored in memory.

The server maintains a map of:

sessionId -> MCP server + transport

When a session closes, the session is removed.

---

# 11. MCP INITIALIZATION

The server requires MCP initialization through POST /mcp.

Initialization requests are validated using the MCP SDK's
isInitializeRequest helper.

Non-initialization POST requests without an established session are
rejected.

Non-POST initialization attempts are rejected.

Unknown MCP session IDs return HTTP 404.

---

# 12. MCP PROTOCOL VERIFICATION

The MCP server was successfully tested with protocol version:

2025-11-25

Successful initialization response:

{
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "tools": {}
    },
    "serverInfo": {
      "name": "tapqr-agentos",
      "version": "0.1.0"
    }
  },
  "jsonrpc": "2.0",
  "id": 1
}

This confirms that the MCP server successfully completes the
initialization handshake for the tested protocol revision.

---

# 13. HEALTH CHECK

Endpoint:

GET /health

Expected response:

{
  "status": "ok",
  "service": "tapqr-agentos-mcp-server"
}

The health endpoint was verified successfully.

---

# 14. CURRENT MCP TOOL

The only functional AgentOS business-independent tool currently registered
is:

agentos_status

Purpose:

Return the current AgentOS MCP server status and implementation stage.

Properties:

read-only:
yes

destructive:
no

idempotent:
yes

open world:
no

Side effects:

none

---

# 15. agentos_status RESPONSE

Example:

{
  "service": "tapqr-agentos",
  "version": "0.1.0",
  "status": "ok",
  "stage": "mcp-foundation",
  "capabilities": [
    "tools"
  ],
  "sideEffects": false
}

---

# 16. TOOL REGISTRATION

Tools are centrally registered through:

src/tools/registry.ts

Current registration flow:

createMcpServer()
        |
        v
registerAllTools()
        |
        +--> registerStatusTool()

Future tools will be added through the same registry rather than being
embedded directly into the HTTP transport.

---

# 17. INPUT VALIDATION

Zod is used for tool input schemas.

The current system-status tool accepts an empty object.

Future tools must define explicit schemas.

Tools must not trust arbitrary model-generated input.

Expected flow:

MCP request
    |
    v
schema validation
    |
    +--> invalid -> controlled error
    |
    v
tool handler