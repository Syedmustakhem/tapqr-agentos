import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  emptyToolInputSchema
} from "./schemas.js";

const SERVER_NAME =
  "tapqr-agentos";

const SERVER_VERSION =
  "0.1.0";

export function registerStatusTool(
  server: McpServer
): void {
  server.registerTool(
    "agentos_status",
    {
      title: "AgentOS Status",

      description:
        "Return the current TapQR AgentOS MCP server status and implementation stage.",

      inputSchema: {
        input:
          emptyToolInputSchema
      },

      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },

    async () => {
      const output = {
        service:
          SERVER_NAME,

        version:
          SERVER_VERSION,

        status:
          "ok",

        stage:
          "phase-2-read-only-tools",

        capabilities: [
          "tools"
        ],

        tools: [
          "agentos_status",
          "get_qr_funnel"
        ],

        sideEffects:
          false
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              output,
              null,
              2
            )
          }
        ],

        structuredContent:
          output
      };
    }
  );
}