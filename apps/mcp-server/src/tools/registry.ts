import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerStatusTool } from "./system/status.js";

export interface ToolRegistrationContext {
  server: McpServer;
}

export function registerAllTools(
  server: McpServer
): void {
  const context: ToolRegistrationContext = {
    server
  };

  registerStatusTool(context.server);
}