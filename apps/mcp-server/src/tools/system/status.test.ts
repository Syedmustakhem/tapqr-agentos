import {
  describe,
  expect,
  it
} from "vitest";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerStatusTool } from "./status.js";

describe("agentos_status tool", () => {
  it("registers the status tool", () => {
    const server = new McpServer(
      {
        name: "test-server",
        version: "0.1.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    expect(() => {
      registerStatusTool(server);
    }).not.toThrow();
  });
});