import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { TapqrApiClient } from "../integrations/tapqr/index.js";
import { getQrFunnelInputSchema } from "./schema.js";

export function registerGetQrFunnelTool(
  server: McpServer
): void {
  server.registerTool(
    "get_qr_funnel",
    {
      title: "Get QR Funnel",

      description:
        "Retrieve real TapQR QR journey analytics for a business. " +
        "Returns the visitor journey funnel, journey overview, daily journey data, " +
        "and QR-level breakdown for a selected period. " +
        "This tool is read-only and does not modify business data.",

      inputSchema: getQrFunnelInputSchema,

      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },

    async ({ businessId, days }) => {
      const client = new TapqrApiClient();

      const analytics =
        await client.getQrJourneyAnalytics(
          businessId,
          days
        );

      const output = {
        businessId,
        period: analytics.period,
        overview: analytics.overview,
        funnel: analytics.funnel,
        dailyJourney: analytics.dailyJourney,
        byQr: analytics.byQr,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output, null, 2),
          },
        ],

        structuredContent: output,
      };
    }
  );
}