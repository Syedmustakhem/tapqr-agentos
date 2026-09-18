# TapQR AgentOS

> **Find the customer journey leak. Understand why. Propose the fix. Get approval. Execute. Verify. Measure.**

TapQR AgentOS is an autonomous growth intelligence layer for TapQR-powered businesses.

Instead of acting as a simple AI interface over existing APIs, AgentOS connects business signals across QR scans, campaigns, routing rules, leads, customer conversations, and conversions to identify measurable customer-journey leaks and take controlled corrective actions.

## Core Idea

A business owner should be able to ask:

> "What's wrong with my customer journey?"

and eventually:

> "Fix it."

AgentOS analyzes the available business signals, identifies a significant growth leak, explains the evidence, proposes an action, requests approval when the action can affect live business behavior, executes the approved change, verifies the persisted state, and measures the outcome.

## Architecture

```text
Alexa+
   |
   v
Alexa+ MCP Add-on
   |
   v
TapQR AgentOS MCP Server
   |
   +--> Intelligence Layer
   |
   +--> Approval / Safety Layer
   |
   v
Existing TapQR Backend
   |
   v
Prisma + PostgreSQL
   |
   +--> QR Scans
   +--> Campaigns
   +--> Routing Rules
   +--> Leads
   +--> WhatsApp
   +--> Conversions
