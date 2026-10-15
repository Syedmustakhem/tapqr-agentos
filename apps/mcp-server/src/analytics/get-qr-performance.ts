
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
        "Analyze QR code performance for a TapQR business. " +
        "Ranks QR codes by conversion rate and identifies QR codes " +
        "with visitors but comparatively lower conversion rates. " +
        "Uses real TapQR journey analytics and is read-only.",
      inputSchema: getQrPerformanceInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ businessId, days, limit }) => {
      const client = new TapqrApiClient();

      const analytics =
        await client.getQrJourneyAnalytics(businessId, days);

      const qrCodes = [...analytics.byQr];

      const ranked = [...qrCodes].sort(
        (a, b) =>
          b.conversionRate - a.conversionRate ||
          b.converters - a.converters ||
          b.visitors - a.visitors
      );

      const topPerformers = ranked
        .slice(0, limit)
        .map((qr, index) => ({
          rank: index + 1,
          ...qr
        }));

      const needsAttention = [...qrCodes]
        .filter((qr) => qr.visitors > 0)
        .sort(
          (a, b) =>
            a.conversionRate - b.conversionRate ||
            b.visitors - a.visitors
        )
        .slice(0, limit);

      const output = {
        businessId,
        period: analytics.period,
        summary: {
          qrCodesAnalyzed: qrCodes.length,
          qrCodesWithVisitors: qrCodes.filter(
            (qr) => qr.visitors > 0
          ).length
        },
        topPerformers,
        needsAttention,
        interpretation:
          "Performance is ranked using TapQR's reported conversion rates. " +
          "The attention list highlights relatively lower conversion rates " +
          "among QR codes with visitors; it does not establish a cause."
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output, null, 2)
          }
        ],
        structuredContent: output
      };
    }
  );
}
