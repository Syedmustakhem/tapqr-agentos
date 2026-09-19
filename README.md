# TapQR AgentOS

## Autonomous QR Growth Intelligence for TapQR

> **Find the customer journey leak. Understand why it is happening. Propose a fix. Get approval. Execute it. Verify the result. Measure the outcome.**

TapQR AgentOS is an agentic growth intelligence layer built on top of the existing TapQR platform.

It turns TapQR from a system that primarily **records QR, campaign, lead, conversion, and customer activity** into a system that can reason about those signals and help a business continuously improve its customer journey.

The project is designed around a controlled autonomous loop:

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
   |
   +--------------------+
                        |
                        v
                     OBSERVE
```

The long-term goal is to make TapQR AgentOS capable of acting as an intelligent growth operator for businesses rather than simply exposing another collection of APIs.

---

# Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The Idea](#the-idea)
- [Why AgentOS](#why-agentos)
- [How It Works](#how-it-works)
- [Core Autonomous Loop](#core-autonomous-loop)
- [Architecture](#architecture)
- [AgentOS Layers](#agentos-layers)
- [MCP Architecture](#mcp-architecture)
- [Existing TapQR Platform](#existing-tapqr-platform)
- [Key Capabilities](#key-capabilities)
- [Planned MCP Tools](#planned-mcp-tools)
- [Safety and Approval Model](#safety-and-approval-model)
- [Verification Model](#verification-model)
- [Example Workflow](#example-workflow)
- [Example Agent Conversation](#example-agent-conversation)
- [What Makes This Different](#what-makes-this-different)
- [Technology Direction](#technology-direction)
- [Repository Structure](#repository-structure)
- [Development Roadmap](#development-roadmap)
- [Current Implementation Status](#current-implementation-status)
- [Development Principles](#development-principles)
- [Security Principles](#security-principles)
- [Testing Strategy](#testing-strategy)
- [Hackathon Direction](#hackathon-direction)
- [Future Possibilities](#future-possibilities)
- [Contributing](#contributing)
- [License](#license)

---

# Overview

TapQR is an existing QR and customer-engagement platform containing business functionality around:

- QR codes
- QR redirects
- campaigns
- QR rules
- QR experiments
- analytics
- scans
- leads
- conversions
- catalogs
- WhatsApp
- reviews
- customer interactions

TapQR AgentOS is a separate intelligence and agent interface layer that operates on top of those capabilities.

The fundamental architectural principle is:

```text
Existing TapQR
     |
     | Business system of record
     |
     v
TapQR AgentOS
     |
     | Intelligence + orchestration
     |
     v
MCP / Agent Interface
     |
     v
AI Agent
```

AgentOS should not duplicate the core TapQR business system.

Instead, it should understand the existing business signals, correlate them, reason about opportunities, and safely orchestrate existing TapQR capabilities.

---

# The Problem

Businesses can generate large amounts of customer interaction data without having a clear understanding of what that data means operationally.

For example, a business may have:

```text
10,000 QR scans
        |
        v
6,500 product/menu views
        |
        v
2,100 meaningful interactions
        |
        v
420 leads
        |
        v
75 conversions
```

The dashboard may display these numbers.

But the important questions are:

- Where is the customer journey leaking?
- Why is that leak happening?
- Which QR experience is responsible?
- Is the problem associated with a particular campaign?
- Is it device-specific?
- Is it location-specific?
- Is it related to a rule?
- Is one experiment performing differently?
- What should the business change?
- What is the expected impact?
- Should the change happen immediately?
- How can the system verify that the change actually worked?

Traditional analytics generally stop at:

```text
DATA -> DASHBOARD
```

TapQR AgentOS is designed to move toward:

```text
DATA
  |
  v
UNDERSTANDING
  |
  v
DECISION SUPPORT
  |
  v
CONTROLLED ACTION
  |
  v
VERIFICATION
  |
  v
LEARNING
```

---

# The Idea

TapQR AgentOS acts as an intelligent growth layer for QR-driven customer journeys.

Instead of asking a business owner to manually inspect multiple dashboards, the agent can eventually answer questions such as:

> "How is my business performing?"

> "What is the biggest customer journey problem right now?"

> "Why is this happening?"

> "Which QR code is responsible?"

> "What changed compared with last week?"

> "What would you recommend changing?"

> "Show me the expected impact."

> "Apply the change."

> "Did it actually work?"

The system is intentionally designed so that the agent does not blindly execute every recommendation.

The workflow separates:

```text
OBSERVATION
```

from:

```text
INFERENCE
```

from:

```text
PROPOSAL
```

from:

```text
ACTION
```

from:

```text
VERIFICATION
```

This separation is fundamental to the project's safety model.

---

# Why AgentOS

A normal API integration might look like:

```text
AI
 |
 +--> GET /business
 |
 +--> GET /campaigns
 |
 +--> GET /analytics
 |
 +--> POST /campaign
```

That exposes APIs.

It does not necessarily create an agentic system.

TapQR AgentOS instead aims to create an operational loop:

```text
Business signals
      |
      v
Context
      |
      v
Correlation
      |
      v
Growth leak detection
      |
      v
Evidence
      |
      v
Proposal
      |
      v
Approval
      |
      v
Controlled action
      |
      v
Verification
      |
      v
Measurement
```

The intelligence layer is therefore not merely a wrapper around existing APIs.

It is an orchestration layer designed around a business objective:

> Continuously identify and improve customer journey performance.

---

# How It Works

At a high level, AgentOS consists of several layers.

```text
+------------------------------------------------------+
|                     AI / Agent                       |
|                                                      |
|   Alexa+ / Other MCP Client / Future Agent Clients  |
+----------------------------+-------------------------+
                             |
                             v
+------------------------------------------------------+
|                  MCP Interface                       |
|                                                      |
|   Tools / Resources / Prompts / Sessions            |
+----------------------------+-------------------------+
                             |
                             v
+------------------------------------------------------+
|                  AgentOS Core                        |
|                                                      |
|  Context -> Intelligence -> Proposal -> Approval    |
|  -> Execution -> Verification -> Measurement        |
+----------------------------+-------------------------+
                             |
                             v
+------------------------------------------------------+
|                TapQR Integration                     |
|                                                      |
| Businesses | QR | Campaigns | Rules | Experiments  |
| Analytics  | Leads | Conversions | WhatsApp | etc.  |
+----------------------------+-------------------------+
                             |
                             v
+------------------------------------------------------+
|                 Existing TapQR                      |
|                                                      |
|             PostgreSQL + Prisma                     |
+------------------------------------------------------+
```

---

# Core Autonomous Loop

The defining architecture of TapQR AgentOS is the growth loop.

## 1. OBSERVE

Collect relevant business signals.

Examples:

- QR scans
- scan sources
- campaign activity
- leads
- conversions
- rule matches
- experiment assignments
- experiment conversions
- customer interactions

---

## 2. CORRELATE

Combine signals that normally live in different parts of the platform.

For example:

```text
QR scans
+
QR rule matches
+
campaign
+
lead creation
+
conversion
+
device
+
location
+
source
```

This allows the agent to reason about the complete journey rather than a single metric.

---

## 3. DETECT

Identify measurable anomalies or opportunities.

Examples:

```text
High scans
+
Low leads
=
Possible lead-generation leak
```

or:

```text
High mobile traffic
+
Low conversion
=
Possible mobile experience issue
```

or:

```text
Campaign A
+
High engagement
+
Low conversion
=
Potential campaign optimization opportunity
```

AgentOS should base these detections on observable evidence.

---

## 4. EXPLAIN

The system should explain why a particular issue was detected.

An explanation should distinguish between:

### Observation

Something directly supported by data.

### Inference

A reasoned interpretation of those observations.

### Uncertainty

What the system cannot confidently establish.

For example:

```text
Observation:
QR A generated 4,200 scans and 110 leads.

Observation:
QR B generated 2,100 scans and 160 leads.

Inference:
QR A currently produces substantially fewer leads per scan.

Uncertainty:
The available data does not establish whether the difference
is caused by the QR destination, traffic quality, audience mix,
or another factor.
```

This prevents the agent from presenting speculation as fact.

---

# 5. PROPOSE

The agent creates a proposed action.

For example:

```text
Problem:
Low lead conversion on QR A.

Proposal:
Create an adaptive QR rule that presents the lead experience
for qualifying visitors.

Expected objective:
Increase lead conversion.

Risk:
Medium.

Action:
Requires approval.
```

The proposal exists separately from execution.

---

# 6. APPROVE

High-impact actions require explicit approval.

The approval layer is intentionally separate from the intelligence layer.

An agent can say:

```text
I found a measurable conversion leak.

I recommend creating an experiment.

Impact:
Medium

Reason:
The proposed change affects the customer experience.

Do you want me to apply it?
```

Only after approval should the corresponding write operation execute.

---

# 7. EXECUTE

The agent invokes an approved TapQR operation.

Examples may include:

- creating a campaign
- updating a campaign
- activating a campaign
- pausing a campaign
- creating a QR rule
- updating a QR rule
- creating a QR experiment
- sending an approved customer follow-up

AgentOS should use existing TapQR business logic wherever possible.

---

# 8. VERIFY

A successful API response is not automatically treated as proof that the intended state exists.

After important mutations:

```text
ACTION
  |
  v
READ BACK STATE
  |
  v
COMPARE EXPECTED VS ACTUAL
  |
  +---- MATCH ----> VERIFIED
  |
  +---- DIFFER ----> VERIFICATION_FAILED
```

This makes verification a first-class part of the architecture.

---

# 9. MEASURE

After execution, AgentOS should eventually compare:

```text
BEFORE
  |
  v
ACTION
  |
  v
AFTER
```

This allows the system to determine whether the change produced a measurable difference.

The long-term goal is a continuous optimization loop rather than one-off automation.

---

# MCP Architecture

TapQR AgentOS exposes its agent capabilities through the Model Context Protocol.

The current MCP server uses:

- TypeScript
- Node.js
- Express
- `@modelcontextprotocol/sdk`
- Streamable HTTP
- Zod
- strict TypeScript

The MCP server endpoint is:

```text
/mcp
```

The health endpoint is:

```text
/health
```

The current protocol target is:

```text
2025-11-25
```

The MCP server identity is:

```text
name:
tapqr-agentos

version:
0.1.0
```

---

# MCP Tool Design

Tools are organized by their role in the AgentOS lifecycle.

## READ_ONLY

Tools that retrieve information without modifying business state.

Examples:

```text
get_business_context
get_qr_funnel
get_campaign_performance
get_qr_performance
get_customer_signal_summary
```

---

## INTELLIGENCE

Tools that analyze business information.

Example:

```text
detect_growth_leaks
```

---

## PROPOSAL

Tools that generate proposed changes without immediately applying them.

Example:

```text
propose_growth_fix
```

---

## WRITE

Controlled operations that modify TapQR state.

Examples:

```text
create_campaign
update_campaign
activate_campaign
pause_campaign
create_qr_rule
update_qr_rule
create_qr_experiment
```

---

## LIVE_WRITE

Actions that have immediate operational consequences.

These require stronger authorization and verification.

---

## EXTERNAL_SIDE_EFFECT

Actions that affect systems or people outside the core TapQR database.

For example:

```text
send_customer_followup
```

These require additional safety considerations.

---

# Existing TapQR Platform

AgentOS is being built around the existing TapQR backend rather than replacing it.

The existing TapQR platform contains domains including:

```text
Authentication
    |
Businesses
    |
Campaigns
    |
QR Codes
    |
QR Rules
    |
QR Experiments
    |
Analytics
    |
Leads
    |
Conversions
    |
WhatsApp
    |
Reviews
    |
Catalogs
```

The existing database uses PostgreSQL through Prisma.

AgentOS will integrate with these existing capabilities through explicit contracts.

---

# Key TapQR Signals

AgentOS can eventually reason over multiple types of business signals.

## QR Signals

Examples:

- scan count
- scan source
- device
- browser
- operating system
- location
- referrer
- UTM information
- QR rule matches
- last scanned time

---

## Campaign Signals

Examples:

- campaign status
- campaign duration
- campaign QR codes
- campaign leads
- campaign performance

---

## Lead Signals

Examples:

- lead creation
- lead source
- campaign association
- QR association
- lead status
- visitor identity

---

## Conversion Signals

Examples:

- conversion type
- conversion value
- currency
- QR association
- rule association
- experiment association
- visitor association

---

## Experiment Signals

Examples:

- experiment allocation
- participants
- variants
- assignments
- conversions
- conversion rates

---

## Customer Interaction Signals

Examples:

- WhatsApp conversations
- customer messages
- conversation status
- priority
- handling mode
- reviews

---

# Planned MCP Tools

The planned tool inventory is intentionally developed in stages.

## Phase 1

Foundation:

```text
agentos_status
```

---

## Phase 2

Read-only business context:

```text
get_business_context
get_qr_funnel
get_campaign_performance
get_qr_performance
get_customer_signal_summary
```

---

## Phase 3

Growth intelligence:

```text
detect_growth_leaks
```

---

## Phase 4

Proposal and approval:

```text
propose_growth_fix
```

---

## Phase 5

Controlled writes:

```text
create_campaign
update_campaign
activate_campaign
pause_campaign
create_qr_rule
update_qr_rule
create_qr_experiment
send_customer_followup
```

Only actions actually supported by the existing TapQR platform will be implemented.

---

# Safety and Approval Model

AgentOS is intentionally designed with a safety boundary between reasoning and action.

The basic principle is:

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

The system should never assume that because an agent suggested an action, the action is automatically authorized.

---

# Authorization

Every business operation must be scoped to the correct business.

The AgentOS principal model contains:

```text
userId
businessId
role
```

Supported business roles currently include:

```text
OWNER
MANAGER
STAFF
```

Authentication and authorization are separate concepts.

Authentication answers:

```text
Who is making this request?
```

Authorization answers:

```text
What is this principal allowed to do?
```

---

# Error Model

AgentOS uses structured errors.

Current error categories include:

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

The objective is to provide useful machine-readable errors without exposing sensitive internal implementation details.

---

# Verification Model

For important actions, AgentOS follows:

```text
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
VERIFY
```

A write operation should not simply return:

```text
success: true
```

and stop.

Instead, AgentOS should establish whether the intended state was actually persisted.

---

# Example Workflow

Suppose a business has:

```text
QR scans:        10,000
Leads:              300
Conversions:         35
```

AgentOS observes the data.

It discovers:

```text
QR A
Scans:              6,000
Leads:                250
Conversions:           30

QR B
Scans:              4,000
Leads:                 50
Conversions:            5
```

AgentOS may identify QR B as a measurable area requiring investigation.

It then examines additional signals:

```text
device
location
campaign
rule matches
experiment assignments
referrer
conversion type
```

The system builds an evidence-based explanation.

It may then propose:

```text
Create a controlled experiment for QR B.

Variant A:
Current experience.

Variant B:
Alternative lead-focused experience.

Allocation:
50/50.

Reason:
The current QR has high traffic but substantially lower
lead and conversion rates than another QR in the same
business context.

Impact:
Medium.

Approval:
Required.
```

The business owner approves.

AgentOS executes the supported TapQR operation.

Then:

```text
READ BACK
    |
    v
VERIFY
    |
    v
REPORT
```

Later, the system can compare the experiment results.

---

# Example Agent Conversation

### Business owner

> How is my business doing?

### Agent

> Your recent QR activity shows strong traffic, but one QR experience has a substantially lower lead conversion rate than your other high-volume QR experiences.

### Business owner

> Which one?

### Agent

> QR B. It has generated 4,000 scans and 50 leads, while another high-volume QR generated 6,000 scans and 250 leads.

### Business owner

> Why?

### Agent

> The available data shows the conversion difference, but it does not establish a single cause. I found that QR B has different rule and traffic characteristics that may explain part of the difference. I recommend testing an alternative experience rather than changing the current experience immediately.

### Business owner

> What do you want to change?

### Agent

> I propose a controlled QR experiment with two variants. The existing experience remains the control, while the proposed experience is tested against it.

### Business owner

> Do it.

### Agent

> Approval confirmed. I will create the experiment, verify that it is active, and report the resulting configuration.

### Agent

> The experiment was created and verified successfully. I will use its conversion data to compare the two variants.

---

# What Makes This Different

TapQR AgentOS is designed around a business problem rather than around an API collection.

A basic API wrapper looks like:

```text
API
 |
 +-- GET data
 |
 +-- POST action
```

AgentOS aims for:

```text
DATA
 |
 v
CONTEXT
 |
 v
CORRELATION
 |
 v
DETECTION
 |
 v
EXPLANATION
 |
 v
PROPOSAL
 |
 v
APPROVAL
 |
 v
ACTION
 |
 v
VERIFICATION
 |
 v
MEASUREMENT
 |
 +----------------------+
                        |
                        v
                     LEARNING
```

The system therefore combines:

- business context
- multi-source correlation
- growth intelligence
- controlled agent actions
- approval
- verification
- measurement

The objective is to make the agent operationally useful while maintaining clear control boundaries.

---

# Technology Direction

The current foundation uses:

```text
TypeScript
Node.js
Express
MCP SDK
Streamable HTTP
Zod
Vitest
PostgreSQL
Prisma
```

The existing TapQR backend provides the business system.

Future phases may incorporate AWS services where they provide a meaningful role in the architecture.

Potential areas include:

```text
Amazon Bedrock
Amazon Bedrock AgentCore
Strands
AWS infrastructure
```

The exact AWS component will be selected based on actual architectural value rather than being added simply to satisfy a checklist.

---

# Repository Structure

Current repository:

```text
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
|       |
|       +-- package.json
|       +-- package-lock.json
|       +-- tsconfig.json
|       |
|       +-- src/
|           |
|           +-- app.ts
|           +-- server.ts
|           |
|           +-- auth/
|           |   +-- principal.ts
|           |
|           +-- errors/
|           |   +-- agentos-error.ts
|           |   +-- error-response.ts
|           |
|           +-- tools/
|           |   +-- registry.ts
|           |   |
|           |   +-- system/
|           |       +-- status.ts
|           |       +-- schemas.ts
|           |
|           +-- transport/
|               +-- http.ts
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
```

The repository is intentionally separated from the existing TapQR application.

This allows AgentOS to evolve independently while integrating with TapQR through defined interfaces.

---

# Development Roadmap

The project follows a fixed roadmap.

## Phase 0 - Foundation

Completed.

Includes:

- repository
- documentation
- architecture
- roadmap
- security model
- initial Git structure

---

## Phase 1 - MCP Server Foundation

Completed.

Includes:

- Node.js
- TypeScript
- MCP SDK
- Streamable HTTP
- server initialization
- health endpoint
- MCP initialization
- tool registration
- validation foundation
- structured errors
- authentication principal contract

---

## Phase 2 - Read-Only Business Tools

Next.

Planned:

```text
get_business_context
get_qr_funnel
get_campaign_performance
get_qr_performance
get_customer_signal_summary
```

No write operations should be introduced during this phase.

The first task is to audit the existing TapQR authentication and business APIs.

---

## Phase 3 - Growth Intelligence

Build:

```text
detect_growth_leaks
```

This phase introduces evidence-based growth analysis.

---

## Phase 4 - Proposal and Approval

Build:

```text
propose_growth_fix
```

This phase introduces:

- proposal objects
- impact classification
- approval state
- approval requirements
- action boundaries

---

## Phase 5 - Controlled Writes

Introduce approved business mutations.

Potential operations:

```text
create_campaign
update_campaign
activate_campaign
pause_campaign
create_qr_rule
update_qr_rule
create_qr_experiment
send_customer_followup
```

Only supported operations will be implemented.

---

## Phase 6 - Verification

Every important write receives a read-back verification step.

The system must detect:

```text
success
failure
partial success
verification failure
```

---

## Phase 7 - Autonomous Growth Loop

Combine the complete lifecycle:

```text
OBSERVE
   |
CORRELATE
   |
DETECT
   |
EXPLAIN
   |
PROPOSE
   |
APPROVE
   |
EXECUTE
   |
VERIFY
   |
MEASURE
```

---

## Phase 8 - Alexa+ Integration

Connect the real AgentOS MCP server to the Alexa+ ecosystem.

The integration must use the actual working MCP runtime.

Planned validation:

- MCP discovery
- tool discovery
- tool invocation
- authentication
- read-only workflows
- proposal workflows
- approval workflows
- write workflows
- verification
- error handling
- user experience

---

## Phase 9 - AWS Integration

Add a meaningful AWS capability.

Possible technologies include:

```text
Amazon Bedrock
Amazon Bedrock AgentCore
Strands
AWS services
```

The integration must provide actual architectural value.

---

## Phase 10 - Open Source

If feasible, make a meaningful open-source contribution during the project period.

The contribution should be substantive rather than purely cosmetic.

---

## Phase 11 - Production Hardening

Address:

- authentication
- authorization
- input validation
- secrets
- rate limiting
- logging
- retries
- idempotency
- verification
- observability
- failure handling
- auditability

---

## Phase 12 - Hackathon Demo

Build a concise end-to-end demonstration.

The story should demonstrate:

```text
Problem
  |
  v
Agent discovers leak
  |
  v
Agent explains evidence
  |
  v
Agent proposes fix
  |
  v
User approves
  |
  v
Agent executes
  |
  v
Agent verifies
  |
  v
Agent measures
```

---

## Phase 13 - Final Submission

Finalize:

- public repository
- working MCP server
- Alexa+ integration
- AWS integration
- documentation
- testing
- demo
- README
- architecture
- security documentation
- final submission materials

---

# Current Implementation Status

Current stage:

```text
Phase 1 - MCP Server Foundation
```

Status:

```text
COMPLETE
```

Implemented foundation includes:

```text
Node.js
TypeScript
MCP SDK
Express
Streamable HTTP
MCP initialization
Health endpoint
Tool registration
Zod validation foundation
Structured errors
Authentication principal contract
```

Current system tool:

```text
agentos_status
```

Current MCP server identity:

```text
tapqr-agentos
0.1.0
```

---

# Development Principles

## 1. Do not skip the roadmap

Each phase must be completed before moving to the next.

---

## 2. Do not invent existing APIs

Before integrating with TapQR:

```text
AUDIT
  |
  v
UNDERSTAND
  |
  v
DESIGN
  |
  v
IMPLEMENT
```

Existing TapQR endpoints and business logic must be verified before AgentOS depends on them.

---

## 3. Keep the existing TapQR system as the source of truth

AgentOS should not create duplicate business logic when TapQR already owns that responsibility.

---

## 4. Separate reasoning from execution

The agent can reason without automatically receiving permission to act.

---

## 5. Verify important actions

A successful write request is not enough.

The system should verify the resulting state.

---

## 6. Make evidence visible

AgentOS should explain the signals behind important recommendations.

---

## 7. Preserve uncertainty

If the system cannot establish why something happened, it should say so.

---

## 8. Design for failure

External services, APIs, databases, networks, and agent calls can fail.

Failure handling is part of the architecture.

---

## 9. Keep actions auditable

Important actions should have enough information to establish:

```text
who
what
when
why
with which inputs
with what result
```

---

## 10. Build the smallest complete loop

A complete:

```text
OBSERVE -> DETECT -> PROPOSE -> APPROVE -> EXECUTE -> VERIFY
```

workflow is more important than implementing many disconnected features.

---

# Security Principles

TapQR AgentOS follows a defense-in-depth model.

Core principles:

```text
Authentication
      |
      v
Authorization
      |
      v
Input Validation
      |
      v
Business Scope
      |
      v
Approval
      |
      v
Execution
      |
      v
Verification
      |
      v
Audit
```

Sensitive configuration should remain outside source control.

Environment variables and secret-management mechanisms should be used for credentials.

The `.gitignore` configuration excludes common secret and build artifacts.

---

# Testing Strategy

Testing will be introduced at multiple layers.

## Unit Tests

Validate:

- schemas
- domain logic
- intelligence calculations
- proposal logic
- approval rules
- verification logic

---

## Integration Tests

Validate:

- TapQR API integration
- authentication
- business scoping
- database interaction
- MCP tool execution

---

## MCP Protocol Tests

Validate:

```text
initialize
tools/list
tools/call
```

and later:

```text
resources
prompts
MCP Apps
```

where applicable.

---

## End-to-End Tests

The final system should be tested as:

```text
Agent
  |
  v
MCP
  |
  v
AgentOS
  |
  v
TapQR
  |
  v
Database
  |
  v
Verification
```

---

# Hackathon Direction

TapQR AgentOS is being developed with an agentic MCP architecture in mind.

The intended demonstration is not:

```text
"Here is an API exposed through MCP."
```

Instead, the demonstration should show:

```text
"Here is an agent that understands a business,
finds a measurable customer journey problem,
explains the evidence,
proposes a controlled intervention,
gets approval,
executes the intervention,
verifies the resulting state,
and measures the outcome."
```

The MCP server is therefore the interface through which an agent can operate TapQR AgentOS capabilities.

The project will also pursue meaningful AWS integration and, where practical, meaningful open-source contribution.

---

# Future Possibilities

The architecture is intentionally extensible.

Potential future capabilities include:

## Adaptive QR Experiences

Automatically personalize QR experiences based on context while respecting approval and safety boundaries.

---

## Campaign Optimization

Identify campaigns with unusual performance and propose controlled improvements.

---

## Experiment Generation

Automatically identify opportunities for A/B experiments.

---

## Customer Journey Diagnosis

Analyze the complete path:

```text
SCAN
 |
v
LAND
 |
v
INTERACT
 |
v
LEAD
 |
v
CONVERT
```

and identify where the largest measurable drop occurs.

---

## Autonomous Monitoring

An agent could periodically evaluate business signals and surface meaningful changes.

---

## Multi-Channel Growth

The same intelligence layer could eventually coordinate:

```text
QR
 |
WhatsApp
 |
Campaigns
 |
Reviews
 |
Leads
 |
Conversions
```

---

## Continuous Learning

Over time, the system could compare proposed interventions with their actual outcomes and improve future proposals.

This must remain evidence-driven and auditable.

---

# Definition of Done

Every phase follows:

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

A phase is not considered complete until all six are satisfied.

---

# Current Checkpoint

```text
Phase 0 - Foundation
        |
        v
      DONE
        |
        v
Phase 1 - MCP Foundation
        |
        v
      DONE
        |
        v
Phase 2 - Read-Only Business Tools
        |
        v
      NEXT
```

The immediate next task is:

```text
PHASE 2.1
Existing TapQR Integration Audit
```

The first tool to implement after that audit will be:

```text
get_business_context
```

The tool will not be implemented until the existing TapQR authentication and business API contracts have been inspected and confirmed.

---

# Contributing

Contributions should preserve the architecture and safety principles described in this document.

Before implementing a feature:

1. Understand the relevant domain.
2. Check the roadmap.
3. Check existing TapQR capabilities.
4. Define the interface.
5. Implement the smallest complete version.
6. Test it.
7. Verify it.
8. Document it.
9. Update the handoff.
10. Commit the completed phase.

---

# License

MIT License

See [LICENSE](LICENSE) for the complete license text.

---

# Project Philosophy

TapQR AgentOS is built around one principle:

> **An agent should not merely know what is happening. It should understand why it matters, propose what could change, act within explicit boundaries, verify what happened, and learn from the result.**

The ultimate goal is not to create another dashboard.

It is to create an intelligent operational layer for QR-driven business growth.

```text
UNDERSTAND
     |
     v
DECIDE
     |
     v
ACT
     |
     v
VERIFY
     |
     v
LEARN
     |
     +----------------------+
                            |
                            v
                        UNDERSTAND
```

**TapQR AgentOS**

Autonomous QR Growth Intelligence.
