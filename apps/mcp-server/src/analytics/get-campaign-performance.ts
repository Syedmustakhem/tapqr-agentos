
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  TapqrApiClient,
} from "../integrations/tapqr/index.js";

import {
  getCampaignPerformanceInputSchema,
} from "./schema.js";

export function registerGetCampaignPerformanceTool(
  server: McpServer
): void {
  server.registerTool(
    "get_campaign_performance",
    {
      title: "Get Campaign Performance",

      description:
        "Retrieve real TapQR campaign performance analytics for a " +
        "specific business and campaign. Returns campaign details, " +
        "the reporting period, total scans, total visitors, total " +
        "conversions, and total conversion value as reported by TapQR. " +
        "This tool is read-only and does not modify business data.",

      inputSchema: getCampaignPerformanceInputSchema,

      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },

    async ({ businessId, campaignId, days }) => {
      const client = new TapqrApiClient();

      const performance =
        await client.getCampaignPerformance(
          businessId,
          campaignId,
          days
        );

      const output = {
        businessId,
        campaignId,

        campaign: performance.campaign,

        period: performance.period,

        summary: {
          totalScans: performance.summary.totalScans,
          totalVisitors: performance.summary.totalVisitors,
          totalConversions: performance.summary.totalConversions,
          totalConversionValue:
            performance.summary.totalConversionValue,
        },

        interpretation: {
          reportingDays: performance.period.days,
          metricsSource: "TapQR campaign analytics",
          conversionValueNote:
            "Total conversion value is reported by TapQR. " +
            "This tool does not independently calculate revenue " +
            "or verify the monetary value of conversions.",
        },

        limitations: [
          "Metrics reflect the reporting period returned by TapQR.",
          "Campaign analytics are not independently recalculated by this tool.",
          "Conversion value should not be interpreted as profit unless the backend explicitly defines it that way.",
          "This tool does not modify campaign or business data.",
        ],
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(output, null, 2),
          },
        ],

        structuredContent: output,
      };
    }
  );
}
