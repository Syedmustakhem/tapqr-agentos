
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
        "Retrieve real TapQR business analytics for a selected period. " +
        "Returns overall scan and conversion metrics, daily scan trends, " +
        "and available QR-level performance data. The current business " +
        "overview API does not provide detailed visitor journey funnel " +
        "stages. This tool is read-only.",

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

      const analytics = await client.getBusinessOverview(
        businessId,
        days
      );

      const overview = analytics.overview;

      const output = {
        businessId,

        period: analytics.period,

        overview: {
          totalScans: overview.totalScans,
          uniqueVisitors: overview.uniqueVisitors,
          previousPeriodScans: overview.previousPeriodScans,
          scanChangePercent: overview.percentageChange,
          totalConversions: overview.totalConversions,
          uniqueConverters: overview.uniqueConverters,
          conversionRate: overview.conversionRate,
          previousPeriodConversions:
            overview.previousPeriodConversions,
          conversionChangePercent:
            overview.conversionPercentageChange,
          activeQrCodes: overview.activeQrCodes,
          totalQrCodes: overview.totalQrCodes,
          averageDailyScans: overview.averageDailyScans,
        },

        dailyScans: analytics.scansByDay,

        qrPerformance: analytics.qrPerformance.map((qr) => ({
          id: qr.id,
          name: qr.name,
          shortCode: qr.shortCode,
          status: qr.status,
          type: qr.type,
          experienceType: qr.experienceType,
          lifetimeScanCount: qr.scanCount,
          createdAt: qr.createdAt,
          updatedAt: qr.updatedAt,
        })),

        funnelAvailability: {
          detailedJourneyFunnelAvailable: false,
          reason:
            "The current business overview endpoint does not return " +
            "visitor journey stages or stage-to-stage drop-off metrics.",
          availableMetrics: [
            "Total scans",
            "Unique visitors",
            "Total conversions",
            "Unique converters",
            "Conversion rate",
            "Daily scan trends",
            "QR-level lifetime scan counts",
          ],
        },

        limitations: [
          "Daily scan trends represent the selected reporting period.",
          "QR-level scanCount is a lifetime count, not a period-specific count.",
          "Overall conversion rate is not a substitute for stage-by-stage funnel conversion.",
          "No visitor journey stages or stage-to-stage drop-off rates are inferred.",
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
