import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const SERVER_NAME = "tapqr-agentos";
const SERVER_VERSION = "0.1.0";

const statusInputSchema = {
  input: z.object({})
};

export function registerStatusTool(
  server: McpServer
): void {
  server.registerTool(
    "agentos_status",
    {
      title: "AgentOS Status",
      description:
        "Return the current TapQR AgentOS MCP server status and implementation stage.",
      inputSchema: statusInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            service: SERVER_NAME,
            version: SERVER_VERSION,
            status: "ok",
            stage: "mcp-foundation",
            capabilities: ["tools"],
            sideEffects: false
          })
        }
      ]
    })
  );
}