import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";

import { createHttpApp } from "./http.js";

describe("TapQR AgentOS MCP HTTP transport", () => {
  let server: ReturnType<ReturnType<typeof createHttpApp>["listen"]>;
  let baseUrl: string;

  beforeAll(async () => {
    const app = createHttpApp();

    server = app.listen(0, "127.0.0.1");

    await new Promise<void>((resolve) => {
      server.once("listening", () => resolve());
    });

    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Unable to determine test server address.");
    }

    const { port } = address as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });

  it("returns a healthy status", async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body).toEqual({
      status: "ok",
      service: "tapqr-agentos-mcp-server"
    });
  });

  it("rejects MCP initialization over non-POST", async () => {
    const response = await fetch(`${baseUrl}/mcp`, {
      method: "GET"
    });

    expect(response.status).toBe(400);

    const body = await response.json();

    expect(body.error).toBe(
      "MCP initialization must use POST"
    );
  });

  it("rejects invalid MCP initialization payloads", async () => {
    const response = await fetch(`${baseUrl}/mcp`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "invalid",
        id: 1
      })
    });

    expect(response.status).toBe(400);

    const body = await response.json();

    expect(body.error).toBe(
      "Expected an MCP initialize request"
    );
  });

  it("initializes an MCP session", async () => {
    const response = await fetch(`${baseUrl}/mcp`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept:
          "application/json, text/event-stream"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-11-25",
          capabilities: {},
          clientInfo: {
            name: "tapqr-agentos-test-client",
            version: "0.1.0"
          }
        }
      })
    });

    expect(response.status).toBe(200);

    const sessionId =
      response.headers.get("mcp-session-id");

    expect(sessionId).toBeTruthy();

    const body = await response.text();

    expect(body).toContain("2025-11-25");
    expect(body).toContain("tapqr-agentos");
  });

  it("rejects unknown MCP sessions", async () => {
    const response = await fetch(`${baseUrl}/mcp`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "mcp-session-id": "unknown-session-id"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {}
      })
    });

    expect(response.status).toBe(404);

    const body = await response.json();

    expect(body.error).toBe(
      "MCP session not found"
    );
  });
});