# TapQR AgentOS Architecture

## 1. Purpose

TapQR AgentOS is an agentic intelligence and controlled-action layer for TapQR.

Its purpose is to connect conversational agent interfaces with real TapQR business signals and eventually allow the agent to identify, explain, and address customer-journey problems.

The core workflow is:

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
2. High-Level Architecture
                         +-----------------+
                         |     Alexa+      |
                         +--------+--------+
                                  |
                                  | MCP
                                  v
                    +--------------------------+
                    | TapQR AgentOS MCP Server |
                    |                          |
                    | Tool Layer               |
                    | Context Layer            |
                    | Intelligence Layer       |
                    | Approval Layer           |
                    | Action Layer              |
                    | Verification Layer        |
                    +------------+-------------+
                                 |
                                 | Authenticated
                                 | business operations
                                 v
                    +--------------------------+
                    | Existing TapQR Backend   |
                    |                          |
                    | Authentication           |
                    | Businesses               |
                    | Campaigns                |
                    | QR Codes                 |
                    | Analytics                |
                    | QR Rules                 |
                    | Experiments              |
                    | Leads                    |
                    | WhatsApp                 |
                    | Reviews                  |
                    | Conversions              |
                    +------------+-------------+
                                 |
                                 v
                    +--------------------------+
                    | Prisma + PostgreSQL      |
                    +--------------------------+

3. Alexa+ Layer

User:
"How is my business doing?"

        |
        v

Alexa+

        |
        | MCP request
        v

TapQR AgentOS

        |
        v

Business analysis

        |
        v

Alexa+

        |
        v

Conversational response


4. MCP Server

The MCP server is the integration boundary between Alexa+ and AgentOS.

It will expose meaningful business capabilities rather than blindly exposing every existing REST endpoint.

Initial planned capabilities include:

get_business_context
get_qr_funnel
get_campaign_performance
get_qr_performance
get_customer_signal_summary
detect_growth_leaks
propose_growth_fix

Controlled write capabilities will be introduced later.

5. Context Layer

The context layer establishes the business context for every request.

Conceptually:

MCP Request
    |
    v
Authenticated Identity
    |
    v
Business Membership
    |
    v
Authorized Business Context
    |
    v
Tool Execution

The system must not trust an arbitrary business identifier supplied by the model.

6. Intelligence Layer

The intelligence layer combines business signals to identify meaningful customer-journey problems.

Relevant signals may include:

QR Scans
    |
    +----> Rule Matches
    |
    +----> Campaigns
    |
    +----> Leads
    |
    +----> Customer Conversations
    |
    +----> Conversions

The intelligence layer should distinguish between:

Observed Data

Derived Analysis

Inference

Proposed Action

These should not be presented as if they have the same level of certainty.

7. Growth Leak Detection

The central intelligence capability is:

detect_growth_leaks

Its purpose is to identify measurable bottlenecks in the customer journey.

Conceptual example:

QR Scans
12,481
    |
    v
Product Interactions
4,203
    |
    v
Leads
286
    |
    v
Conversions
31

AgentOS should identify significant drop-offs and investigate relevant dimensions such as:

QR code
Campaign
Traffic source
Device
Routing rule
Time period
Customer signal

The exact detection algorithm will be designed and implemented during the intelligence phase.

8. Proposal Layer

After identifying a growth leak, AgentOS can create a proposed corrective action.

Conceptually:

Detected Problem
       |
       v
Evidence
       |
       v
Possible Cause
       |
       v
Proposed Change
       |
       v
Expected Effect

A proposal is not automatically a live mutation.

9. Approval Layer

Actions that can materially affect live business behavior require appropriate authorization and explicit approval.

Conceptually:

Agent detects problem
        |
        v
Agent creates proposal
        |
        v
Impact assessment
        |
        v
Approval required
        |
        v
User approval
        |
        v
Action becomes executable

This prevents the agent from making uncontrolled production changes.

10. Action Layer

Approved actions will eventually be executed through the appropriate TapQR business capabilities.

Potential actions include:

Campaign changes
QR rule changes
Experiment creation
Customer follow-up

AgentOS should avoid duplicating TapQR business logic unnecessarily.

Preferred architecture:

MCP Tool
    |
    v
AgentOS Service
    |
    v
Existing TapQR Capability
    |
    v
Database
11. Verification Layer

A successful action response does not automatically prove that the intended state exists.

Therefore, meaningful writes should follow:

Execute
   |
   v
Read persisted state
   |
   v
Compare expected state
   |
   v
Verification Result

If verification fails, AgentOS must report the actual state rather than claiming success.

12. Measurement Layer

After an action has been executed and verified, relevant business signals can be measured again.

Conceptually:

BEFORE
   |
   v
ACTION
   |
   v
AFTER
   |
   v
COMPARISON

This allows AgentOS to evaluate whether an intervention produced a measurable change.

13. Existing TapQR Backend

AgentOS will build on the existing TapQR system rather than recreating its business functionality.

The existing platform contains domains including:

Authentication
Businesses
Campaigns
QR Codes
Analytics
QR Rules
QR Experiments
Leads
WhatsApp
Reviews
Conversions

The exact integration points will be documented during the TapQR integration audit.

14. Data Flow
Read Operation
User
  |
  v
Alexa+
  |
  v
MCP
  |
  v
AgentOS Tool
  |
  v
Authenticated Business Context
  |
  v
TapQR Capability
  |
  v
Prisma
  |
  v
PostgreSQL
  |
  v
Business Data
  |
  v
AgentOS Analysis
  |
  v
Alexa+
Controlled Write Operation
User
  |
  v
Alexa+
  |
  v
AgentOS
  |
  v
Detect Problem
  |
  v
Propose Action
  |
  v
Request Approval
  |
  v
User Approval
  |
  v
Authorization
  |
  v
TapQR Business Logic
  |
  v
Database Mutation
  |
  v
Read-Back Verification
  |
  v
Result
15. Security Boundary

AgentOS must not bypass TapQR's existing authorization model.

Every protected operation should establish:

Identity
   |
   v
Business Membership
   |
   v
Permission
   |
   v
Requested Capability

Model-generated parameters are untrusted input.

16. Core Architectural Principle

AgentOS is not intended to become:

AI
 |
 v
Random API Calls

It is intended to become:

Business Signals
       |
       v
Agent Understanding
       |
       v
Evidence
       |
       v
Decision Proposal
       |
       v
Controlled Action
       |
       v
Verification
       |
       v
Measurement