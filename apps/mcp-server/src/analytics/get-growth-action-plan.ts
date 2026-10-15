
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TapqrApiClient } from "../integrations/tapqr/index.js";
import { getGrowthActionPlanInputSchema } from "./schema.js";

export function registerGetGrowthActionPlanTool(
  server: McpServer
): void {
  server.registerTool(
    "get_growth_action_plan",
    {
      title: "Get Growth Action Plan",
      description:
        "Analyze TapQR journey analytics and produce a prioritized, " +
        "evidence-based QR growth action plan. Uses observed funnel " +
        "and QR metrics, with recommendations clearly labeled as " +
        "heuristics. Read-only; does not modify business data.",
      inputSchema: getGrowthActionPlanInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ businessId, days }) => {
      const client = new TapqrApiClient();
      const analytics = await client.getQrJourneyAnalytics(
        businessId,
        days
      );

      const overview = analytics.overview;
      const actions: Array<{
        priority: "high" | "medium" | "low";
        area: string;
        observation: string;
        recommendedAction: string;
        evidence: Record<string, string | number>;
      }> = [];

      // Find the largest relative drop between consecutive
      // funnel stages, preserving the API's supplied stage order.
      const stages = analytics.funnel;
      let largestDrop:
        | {
            from: string;
            to: string;
            visitorsLost: number;
            dropRate: number;
          }
        | undefined;

      for (let i = 1; i < stages.length; i++) {
        const previous = stages[i - 1];
        const current = stages[i];

        if (
          previous.visitors > 0 &&
          current.visitors <= previous.visitors
        ) {
          const visitorsLost =
            previous.visitors - current.visitors;
          const dropRate = visitorsLost / previous.visitors;

          if (
            !largestDrop ||
            dropRate > largestDrop.dropRate
          ) {
            largestDrop = {
              from: previous.stage,
              to: current.stage,
              visitorsLost,
              dropRate
            };
          }
        }
      }

      if (largestDrop && largestDrop.visitorsLost > 0) {
        actions.push({
          priority: "high",
          area: "Funnel optimization",
          observation:
            `The largest observed relative drop is between ` +
            `${largestDrop.from} and ${largestDrop.to}.`,
          recommendedAction:
            "Review the user experience and call to action between " +
            "these stages. Test one change at a time and compare results.",
          evidence: {
            fromStage: largestDrop.from,
            toStage: largestDrop.to,
            visitorsLost: largestDrop.visitorsLost,
            relativeDropRate: Number(
              largestDrop.dropRate.toFixed(4)
            )
          }
        });
      }

      const zeroConversionQrs = analytics.byQr
        .filter(
          (qr) => qr.visitors > 0 && qr.converters === 0
        )
        .sort((a, b) => b.visitors - a.visitors);

      if (zeroConversionQrs.length > 0) {
        const affectedVisitors = zeroConversionQrs.reduce(
          (total, qr) => total + qr.visitors,
          0
        );

        actions.push({
          priority: "high",
          area: "QR conversion",
          observation:
            `${zeroConversionQrs.length} QR code(s) received visitors ` +
            "but recorded no converters in the selected period.",
          recommendedAction:
            "Review the destination page, offer clarity, QR placement, " +
            "and call to action for these QR codes. Run a controlled test " +
            "before deciding what caused the result.",
          evidence: {
            qrCodesAffected: zeroConversionQrs.length,
            visitorsAcrossAffectedQrs: affectedVisitors,
            examples: zeroConversionQrs.slice(0, 5).map((qr) => ({
              qrCodeId: qr.qrCodeId,
              qrName: qr.qrName,
              visitors: qr.visitors,
              converters: qr.converters
            })).length
          }
        });
      }

      if (
        overview.uniqueVisitors > 0 &&
        overview.uniqueConverters === 0
      ) {
        actions.push({
          priority: "high",
          area: "Overall conversion",
          observation:
            "Visitors were recorded, but no unique converters were " +
            "reported in the selected period.",
          recommendedAction:
            "Check the conversion event configuration first. If tracking " +
            "is correct, simplify the conversion journey and test a clearer " +
            "call to action.",
          evidence: {
            uniqueVisitors: overview.uniqueVisitors,
            uniqueConverters: overview.uniqueConverters
          }
        });
      }

      if (
        overview.uniqueVisitors > 0 &&
        overview.repeatVisitors === 0
      ) {
        actions.push({
          priority: "medium",
          area: "Retention",
          observation:
            "No repeat visitors were reported during this period.",
          recommendedAction:
            "Consider a relevant reason to return, such as an updated offer, " +
            "useful content, or a loyalty incentive. Measure repeat visits " +
            "before and after the experiment.",
          evidence: {
            uniqueVisitors: overview.uniqueVisitors,
            repeatVisitors: overview.repeatVisitors
          }
        });
      }

      if (actions.length === 0) {
        actions.push({
          priority: "low",
          area: "Measurement and experimentation",
          observation:
            "The available metrics did not trigger the current action rules.",
          recommendedAction:
            "Review the daily trend and QR-level results, then choose one " +
            "measurable experiment based on the business goal.",
          evidence: {
            uniqueVisitors: overview.uniqueVisitors,
            uniqueConverters: overview.uniqueConverters,
            qrCodesAnalyzed: analytics.byQr.length
          }
        });
      }

      const output = {
        businessId,
        period: analytics.period,
        generatedFrom: "TapQR journey analytics",
        summary: {
          uniqueVisitors: overview.uniqueVisitors,
          repeatVisitors: overview.repeatVisitors,
          uniqueConverters: overview.uniqueConverters,
          visitorConversionRate: overview.visitorConversionRate,
          totalQrCodesAnalyzed: analytics.byQr.length
        },
        largestFunnelDrop: largestDrop ?? null,
        zeroConversionQrCodes: zeroConversionQrs.map((qr) => ({
          qrCodeId: qr.qrCodeId,
          qrName: qr.qrName,
          visitors: qr.visitors,
          converters: qr.converters,
          conversionRate: qr.conversionRate
        })),
        actions,
        limitations: [
          "Recommendations are rules-based heuristics, not causal findings.",
          "A zero-conversion result does not prove that a QR code or page is ineffective.",
          "Recommendations do not change business data."
        ]
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
