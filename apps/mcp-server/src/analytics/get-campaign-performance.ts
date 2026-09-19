import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  TapqrApiClient
} from "../integrations/tapqr/index.js";

import {
  getCampaignPerformanceInputSchema
} from "./schemas.js";

export function registerGetCampaignPerformanceTool(
  server: McpServer
): void {
  server.registerTool(
    "get_campaign_performance",
    {
      title: "Get Campaign Performance",

      description:
        "Retrieve real TapQR campaign performance analytics for a business and campaign. Returns campaign details, analysis period, total scans, total visitors, total conversions, and total conversion value. This tool is read-only and does not modify business data.",

      inputSchema:
        getCampaignPerformanceInputSchema,

      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },

    async ({
      businessId,
      campaignId,
      days
    }) => {
      const client =
        new TapqrApiClient();

      const performance =
        await client.getCampaignPerformance(
          businessId,
          campaignId,
          days
        );

      const output = {
        businessId,
        campaignId,

        campaign:
          performance.campaign,

        period:
          performance.period,

        summary:
          performance.summary
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