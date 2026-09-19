import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerStatusTool } from "./tools/system/status.js";

const SERVER_NAME = "tapqr-agentos";
const SERVER_VERSION = "0.1.0";

export function createMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  registerStatusTool(server);

  return server;
}