import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerStatusTool } from "./system/status.js";
import { registerGetQrFunnelTool } from "../analytics/get-qr-funnel.js";
import { registerGetCampaignPerformanceTool } from "../analytics/get-campaign-performance.js";

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

  registerGetQrFunnelTool(context.server);

  registerGetCampaignPerformanceTool(context.server);
}