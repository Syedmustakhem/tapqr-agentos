
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TapqrApiClient } from "../integrations/tapqr/index.js";
import { getQrPerformanceInputSchema } from "./schema.js";

export function registerGetQrPerformanceTool(
  server: McpServer
): void {
  server.registerTool(
    "get_qr_performance",
    {
      title: "Get QR Performance",
      description:
        "Analyze QR code performance for a TapQR business using " +
        "real business analytics. Ranks QR codes by lifetime scan " +
        "count and identifies QR codes with zero recorded scans. " +
        "Period-specific overview metrics are reported separately. " +
        "This tool is read-only.",
      inputSchema: getQrPerformanceInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ businessId, days, limit }) => {
      const client = new TapqrApiClient();

      const analytics = await client.getBusinessOverview(
        businessId,
        days
      );

      // The backend's scanCount is a lifetime count, not a
      // period-specific count.
      const qrCodes = [...analytics.qrPerformance].sort(
        (a, b) => b.scanCount - a.scanCount
      );

      const topPerformers = qrCodes
        .filter((qr) => qr.scanCount > 0)
        .slice(0, limit)
        .map((qr, index) => ({
          rank: index + 1,
          ...qr,
        }));

      const needsAttention = qrCodes
        .filter((qr) => qr.scanCount === 0)
        .slice(0, limit)
        .map((qr) => ({
          ...qr,
          reason: "No lifetime scans are recorded for this QR code.",
        }));

      const output = {
        businessId,
        period: analytics.period,
        summary: {
          totalScans: analytics.overview.totalScans,
          uniqueVisitors: analytics.overview.uniqueVisitors,
          totalConversions: analytics.overview.totalConversions,
          conversionRate: analytics.overview.conversionRate,
          activeQrCodes: analytics.overview.activeQrCodes,
          totalQrCodes: analytics.overview.totalQrCodes,
          qrCodesAnalyzed: qrCodes.length,
          qrCodesWithRecordedScans: qrCodes.filter(
            (qr) => qr.scanCount > 0
          ).length,
          qrCodesWithZeroRecordedScans: qrCodes.filter(
            (qr) => qr.scanCount === 0
          ).length,
        },
        topPerformers,
        needsAttention,
        interpretation:
          "The summary metrics cover the requested reporting period. " +
          "Individual QR codes are ranked by lifetime scan count, " +
          "because the backend response does not provide period-specific " +
          "scan counts or per-QR conversion rates. QR codes with zero " +
          "recorded lifetime scans are highlighted for review. " +
          "These metrics do not establish the cause of performance.",
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
