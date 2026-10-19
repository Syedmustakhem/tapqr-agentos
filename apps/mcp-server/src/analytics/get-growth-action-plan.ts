
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TapqrApiClient } from "../integrations/tapqr/index.js";
import { getGrowthActionPlanInputSchema } from "./schema.js";

type ActionPriority = "high" | "medium" | "low";

interface GrowthAction {
  priority: ActionPriority;
  area: string;
  observation: string;
  recommendedAction: string;
  evidence: Record<string, string | number>;
}

export function registerGetGrowthActionPlanTool(
  server: McpServer
): void {
  server.registerTool(
    "get_growth_action_plan",
    {
      title: "Get Growth Action Plan",
      description:
        "Analyze real TapQR business analytics to produce a " +
        "prioritized, evidence-based QR growth action plan. " +
        "Uses period-specific business metrics and available QR " +
        "performance data. Recommendations are rules-based " +
        "heuristics, not causal findings. Read-only.",
      inputSchema: getGrowthActionPlanInputSchema,
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
      const qrCodes = analytics.qrPerformance;

      const actions: GrowthAction[] = [];

      // 1. Check overall conversion performance.
      if (
        overview.uniqueVisitors > 0 &&
        overview.uniqueConverters === 0
      ) {
        actions.push({
          priority: "high",
          area: "Overall conversion",
          observation:
            "Unique visitors were recorded, but no unique " +
            "converters were reported during the selected period.",
          recommendedAction:
            "First verify conversion event configuration and tracking. " +
            "If tracking is correct, review the destination experience, " +
            "offer clarity, and call to action. Test one change at a time.",
          evidence: {
            uniqueVisitors: overview.uniqueVisitors,
            uniqueConverters: overview.uniqueConverters,
            reportingDays: analytics.period.days,
          },
        });
      } else if (
        overview.uniqueVisitors > 0 &&
        overview.conversionRate < 2
      ) {
        actions.push({
          priority: "high",
          area: "Conversion optimization",
          observation:
            "The reported overall conversion rate is below the " +
            "2% heuristic threshold.",
          recommendedAction:
            "Review the landing-page experience, offer relevance, " +
            "page loading, and call to action. Establish a baseline " +
            "and compare controlled experiments before drawing conclusions.",
          evidence: {
            uniqueVisitors: overview.uniqueVisitors,
            uniqueConverters: overview.uniqueConverters,
            conversionRate: overview.conversionRate,
            heuristicThresholdPercent: 2,
          },
        });
      }

      // 2. Identify QR codes with no recorded lifetime scans.
      // The backend's qrPerformance.scanCount is a lifetime count,
      // not a count limited to the requested reporting period.
      const zeroScanQrs = qrCodes.filter(
        (qr) => qr.scanCount === 0
      );

      if (zeroScanQrs.length > 0) {
        actions.push({
          priority: "medium",
          area: "QR activation",
          observation:
            `${zeroScanQrs.length} QR code(s) have zero recorded ` +
            "lifetime scans in the returned QR performance data.",
          recommendedAction:
            "Check whether these QR codes are published, placed " +
            "where customers can see them, printed correctly, and " +
            "linked to the intended destination. Confirm tracking " +
            "before concluding that a QR code has not been used.",
          evidence: {
            qrCodesWithZeroRecordedScans: zeroScanQrs.length,
            examples: zeroScanQrs.length > 0
              ? zeroScanQrs.length > 5
                ? 5
                : zeroScanQrs.length
              : 0,
          },
        });
      }

      // 3. Review QR codes with recorded scans.
      const scannedQrs = [...qrCodes]
        .filter((qr) => qr.scanCount > 0)
        .sort((a, b) => a.scanCount - b.scanCount);

      if (
        scannedQrs.length >= 2 &&
        scannedQrs[0]
      ) {
        const lowestScannedQr = scannedQrs[0];
        const highestScannedQr = scannedQrs[
          scannedQrs.length - 1
        ];

        if (
          highestScannedQr &&
          highestScannedQr.scanCount >
            lowestScannedQr.scanCount
        ) {
          actions.push({
            priority: "medium",
            area: "QR distribution",
            observation:
              "Recorded lifetime scan counts vary across QR codes. " +
              "The lowest-scanned QR code has fewer scans than the " +
              "highest-scanned QR code.",
            recommendedAction:
              "Compare placement, visibility, audience, and promotion " +
              "for the lower-scanned QR codes. Use reporting-period " +
              "metrics where available for a fair time-based comparison.",
            evidence: {
              lowestScannedQrName: lowestScannedQr.name,
              lowestLifetimeScanCount: lowestScannedQr.scanCount,
              highestScannedQrName: highestScannedQr.name,
              highestLifetimeScanCount: highestScannedQr.scanCount,
            },
          });
        }
      }

      // 4. Check for a decline against the previous reporting period.
      if (
        overview.previousPeriodScans > 0 &&
        overview.percentageChange < 0
      ) {
        actions.push({
          priority: "medium",
          area: "Traffic recovery",
          observation:
            "Total scans decreased compared with the previous " +
            "reporting period.",
          recommendedAction:
            "Review recent changes in QR placement, campaign activity, " +
            "distribution, and destination availability. Compare daily " +
            "trends to identify when the decline began.",
          evidence: {
            totalScans: overview.totalScans,
            previousPeriodScans: overview.previousPeriodScans,
            percentageChange: overview.percentageChange,
          },
        });
      }

      // 5. Check whether traffic is growing without conversions growing.
      if (
        overview.previousPeriodScans > 0 &&
        overview.previousPeriodConversions > 0 &&
        overview.percentageChange > 0 &&
        overview.conversionPercentageChange < 0
      ) {
        actions.push({
          priority: "medium",
          area: "Traffic quality",
          observation:
            "Scans increased while conversions decreased compared " +
            "with the previous reporting period.",
          recommendedAction:
            "Check whether the new traffic is reaching the intended " +
            "audience and whether the destination and offer match the " +
            "QR placement. Validate event tracking before changing the campaign.",
          evidence: {
            scanChangePercent: overview.percentageChange,
            conversionChangePercent:
              overview.conversionPercentageChange,
            totalScans: overview.totalScans,
            totalConversions: overview.totalConversions,
          },
        });
      }

      // 6. Provide a default action when no rule was triggered.
      if (actions.length === 0) {
        actions.push({
          priority: "low",
          area: "Measurement and experimentation",
          observation:
            "The available business overview metrics did not " +
            "trigger the current growth action rules.",
          recommendedAction:
            "Review daily scan trends, compare QR codes using " +
            "period-appropriate metrics where available, and select " +
            "one measurable experiment tied to a business goal.",
          evidence: {
            totalScans: overview.totalScans,
            uniqueVisitors: overview.uniqueVisitors,
            totalConversions: overview.totalConversions,
            conversionRate: overview.conversionRate,
            totalQrCodes: qrCodes.length,
          },
        });
      }

      // Stable ordering: high, then medium, then low.
      const priorityOrder: Record<ActionPriority, number> = {
        high: 0,
        medium: 1,
        low: 2,
      };

      actions.sort(
        (a, b) =>
          priorityOrder[a.priority] - priorityOrder[b.priority]
      );

      const output = {
        businessId,
        period: analytics.period,
        generatedFrom: "TapQR business overview analytics",
        summary: {
          totalScans: overview.totalScans,
          uniqueVisitors: overview.uniqueVisitors,
          previousPeriodScans: overview.previousPeriodScans,
          scanChangePercent: overview.percentageChange,
          totalConversions: overview.totalConversions,
          uniqueConverters: overview.uniqueConverters,
          conversionRate: overview.conversionRate,
          conversionChangePercent:
            overview.conversionPercentageChange,
          totalQrCodes: overview.totalQrCodes,
          activeQrCodes: overview.activeQrCodes,
        },
        qrCodesWithZeroRecordedLifetimeScans:
          zeroScanQrs.map((qr) => ({
            id: qr.id,
            name: qr.name,
            shortCode: qr.shortCode,
            status: qr.status,
            lifetimeScanCount: qr.scanCount,
          })),
        actions,
        limitations: [
          "Recommendations are rules-based heuristics, not causal findings.",
          "The 2% conversion threshold is a configurable heuristic, not a universal benchmark.",
          "Per-QR scanCount represents lifetime scans, not scans limited to the requested period.",
          "The business overview response does not provide the journey funnel or per-QR conversion rates.",
          "QR status and zero recorded scans alone do not establish the cause of performance.",
          "This tool is read-only and does not modify business data.",
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
