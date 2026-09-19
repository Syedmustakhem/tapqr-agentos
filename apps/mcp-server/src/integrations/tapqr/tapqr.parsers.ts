import {
  AgentOsError
} from "../../errors/agentos-error.js";

import type {
  TapqrJourneyAnalytics,
  TapqrJourneyDailyRow,
  TapqrJourneyFunnelStage,
  TapqrJourneyOverview,
  TapqrJourneyQrRow
} from "./tapqr.types.js";
import type {
  TapqrCampaign,
  TapqrCampaignPerformance,
  TapqrCampaignPerformancePeriod,
  TapqrCampaignPerformanceSummary
} from "./tapqr.types.js";

function parseCampaign(
  value: unknown
): TapqrCampaign {
  const campaign = asObject(
    value,
    "campaign"
  );

  return {
    id: asString(
      campaign.id,
      "campaign.id"
    ),

    businessId: asString(
      campaign.businessId,
      "campaign.businessId"
    ),

    name: asString(
      campaign.name,
      "campaign.name"
    ),

    description:
      campaign.description === null
        ? null
        : asString(
            campaign.description,
            "campaign.description"
          ),

    status: asString(
      campaign.status,
      "campaign.status"
    ),

    startsAt:
      campaign.startsAt === null
        ? null
        : asString(
            campaign.startsAt,
            "campaign.startsAt"
          ),

    endsAt:
      campaign.endsAt === null
        ? null
        : asString(
            campaign.endsAt,
            "campaign.endsAt"
          ),

    createdAt: asString(
      campaign.createdAt,
      "campaign.createdAt"
    ),

    updatedAt: asString(
      campaign.updatedAt,
      "campaign.updatedAt"
    )
  };
}

function parseCampaignPerformanceSummary(
  value: unknown
): TapqrCampaignPerformanceSummary {
  const summary = asObject(
    value,
    "campaign performance summary"
  );

  return {
    totalScans: asNumber(
      summary.totalScans,
      "summary.totalScans"
    ),

    totalVisitors: asNumber(
      summary.totalVisitors,
      "summary.totalVisitors"
    ),

    totalConversions: asNumber(
      summary.totalConversions,
      "summary.totalConversions"
    ),

    totalConversionValue: asNumber(
      summary.totalConversionValue,
      "summary.totalConversionValue"
    )
  };
}

function parseCampaignPerformancePeriod(
  value: unknown
): TapqrCampaignPerformancePeriod {
  const period = asObject(
    value,
    "campaign performance period"
  );

  return {
    days: asNumber(
      period.days,
      "period.days"
    ),

    startDate: asString(
      period.startDate,
      "period.startDate"
    ),

    endDate: asString(
      period.endDate,
      "period.endDate"
    )
  };
}

export function extractCampaignPerformance(
  payload: unknown
): TapqrCampaignPerformance {
  const root = asObject(
    payload,
    "campaign performance response"
  );

  const data = asObject(
    root.data,
    "campaign performance data"
  );

  return {
    campaign: parseCampaign(
      data.campaign
    ),

    period: parseCampaignPerformancePeriod(
      data.period
    ),

    summary: parseCampaignPerformanceSummary(
      data.summary
    )
  };
}
function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function asString(
  value: unknown,
  field: string
): string {
  if (typeof value !== "string") {
    throw new AgentOsError(
      "INTERNAL_ERROR",
      `TapQR returned an invalid ${field}.`
    );
  }

  return value;
}

function asNumber(
  value: unknown,
  field: string
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    throw new AgentOsError(
      "INTERNAL_ERROR",
      `TapQR returned an invalid ${field}.`
    );
  }

  return value;
}

function asObject(
  value: unknown,
  field: string
): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new AgentOsError(
      "INTERNAL_ERROR",
      `TapQR returned an invalid ${field}.`
    );
  }

  return value;
}

function asArray(
  value: unknown,
  field: string
): unknown[] {
  if (!Array.isArray(value)) {
    throw new AgentOsError(
      "INTERNAL_ERROR",
      `TapQR returned an invalid ${field}.`
    );
  }

  return value;
}

function parseOverview(
  value: unknown
): TapqrJourneyOverview {
  const overview = asObject(
    value,
    "journey overview"
  );

  return {
    uniqueVisitors: asNumber(
      overview.uniqueVisitors,
      "overview.uniqueVisitors"
    ),

    firstTimeVisitors: asNumber(
      overview.firstTimeVisitors,
      "overview.firstTimeVisitors"
    ),

    repeatVisitors: asNumber(
      overview.repeatVisitors,
      "overview.repeatVisitors"
    ),

    repeatVisitorRate: asNumber(
      overview.repeatVisitorRate,
      "overview.repeatVisitorRate"
    ),

    totalIdentifiedScans: asNumber(
      overview.totalIdentifiedScans,
      "overview.totalIdentifiedScans"
    ),

    averageScansPerVisitor: asNumber(
      overview.averageScansPerVisitor,
      "overview.averageScansPerVisitor"
    ),

    totalConversions: asNumber(
      overview.totalConversions,
      "overview.totalConversions"
    ),

    uniqueConverters: asNumber(
      overview.uniqueConverters,
      "overview.uniqueConverters"
    ),

    visitorConversionRate: asNumber(
      overview.visitorConversionRate,
      "overview.visitorConversionRate"
    ),

    conversionsAfterRepeatVisit: asNumber(
      overview.conversionsAfterRepeatVisit,
      "overview.conversionsAfterRepeatVisit"
    ),

    averageTimeToConversionSeconds: asNumber(
      overview.averageTimeToConversionSeconds,
      "overview.averageTimeToConversionSeconds"
    )
  };
}

function parseFunnel(
  value: unknown
): TapqrJourneyFunnelStage[] {
  const rows = asArray(
    value,
    "journey funnel"
  );

  return rows.map(
    (row, index) => {
      const item = asObject(
        row,
        `journey funnel row ${index}`
      );

      return {
        stage: asString(
          item.stage,
          `journey funnel row ${index}.stage`
        ),

        visitors: asNumber(
          item.visitors,
          `journey funnel row ${index}.visitors`
        )
      };
    }
  );
}

function parseDailyJourney(
  value: unknown
): TapqrJourneyDailyRow[] {
  const rows = asArray(
    value,
    "daily journey"
  );

  return rows.map(
    (row, index) => {
      const item = asObject(
        row,
        `daily journey row ${index}`
      );

      return {
        date: asString(
          item.date,
          `daily journey row ${index}.date`
        ),

        visitors: asNumber(
          item.visitors,
          `daily journey row ${index}.visitors`
        ),

        repeatVisitors: asNumber(
          item.repeatVisitors,
          `daily journey row ${index}.repeatVisitors`
        ),

        converters: asNumber(
          item.converters,
          `daily journey row ${index}.converters`
        )
      };
    }
  );
}

function parseByQr(
  value: unknown
): TapqrJourneyQrRow[] {
  const rows = asArray(
    value,
    "journey QR breakdown"
  );

  return rows.map(
    (row, index) => {
      const item = asObject(
        row,
        `journey QR row ${index}`
      );

      return {
        qrCodeId: asString(
          item.qrCodeId,
          `journey QR row ${index}.qrCodeId`
        ),

        qrName: asString(
          item.qrName,
          `journey QR row ${index}.qrName`
        ),

        visitors: asNumber(
          item.visitors,
          `journey QR row ${index}.visitors`
        ),

        repeatVisitors: asNumber(
          item.repeatVisitors,
          `journey QR row ${index}.repeatVisitors`
        ),

        converters: asNumber(
          item.converters,
          `journey QR row ${index}.converters`
        ),

        conversionRate: asNumber(
          item.conversionRate,
          `journey QR row ${index}.conversionRate`
        )
      };
    }
  );
}

export function extractJourneyAnalytics(
  payload: unknown
): TapqrJourneyAnalytics {
  const root = asObject(
    payload,
    "journey analytics response"
  );

  /*
   * TapQR controllers use:
   *
   * ResponseHandler.success(
   *   res,
   *   message,
   *   result
   * )
   *
   * The normal response contract is expected to expose
   * the service result under `data`.
   *
   * We intentionally validate the envelope rather than
   * trusting arbitrary JSON from the upstream service.
   */
  const data = asObject(
    root.data,
    "journey analytics data"
  );

  const period = asObject(
    data.period,
    "journey analytics period"
  );

  return {
    period: {
      days: asNumber(
        period.days,
        "period.days"
      ),

      startDate: asString(
        period.startDate,
        "period.startDate"
      ),

      endDate: asString(
        period.endDate,
        "period.endDate"
      )
    },

    overview: parseOverview(
      data.overview
    ),

    funnel: parseFunnel(
      data.funnel
    ),

    dailyJourney: parseDailyJourney(
      data.dailyJourney
    ),

    byQr: parseByQr(
      data.byQr
    )
  };
}