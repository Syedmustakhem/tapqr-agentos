export interface TapqrJourneyPeriod {
  days: number;
  startDate: string;
  endDate: string;
}

export interface TapqrJourneyOverview {
  uniqueVisitors: number;
  firstTimeVisitors: number;
  repeatVisitors: number;
  repeatVisitorRate: number;
  totalIdentifiedScans: number;
  averageScansPerVisitor: number;
  totalConversions: number;
  uniqueConverters: number;
  visitorConversionRate: number;
  conversionsAfterRepeatVisit: number;
  averageTimeToConversionSeconds: number;
}

export interface TapqrJourneyFunnelStage {
  stage: string;
  visitors: number;
}

export interface TapqrJourneyDailyRow {
  date: string;
  visitors: number;
  repeatVisitors: number;
  converters: number;
}

export interface TapqrJourneyQrRow {
  qrCodeId: string;
  qrName: string;
  visitors: number;
  repeatVisitors: number;
  converters: number;
  conversionRate: number;
}
export interface TapqrCampaign {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  status: string;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TapqrCampaignPerformancePeriod {
  days: number;
  startDate: string;
  endDate: string;
}

export interface TapqrCampaignPerformanceSummary {
  totalScans: number;
  totalVisitors: number;
  totalConversions: number;
  totalConversionValue: number;
}

export interface TapqrCampaignPerformance {
  campaign: TapqrCampaign;
  period: TapqrCampaignPerformancePeriod;
  summary: TapqrCampaignPerformanceSummary;
}
export interface TapqrJourneyAnalytics {
  period: TapqrJourneyPeriod;
  overview: TapqrJourneyOverview;
  funnel: TapqrJourneyFunnelStage[];
  dailyJourney: TapqrJourneyDailyRow[];
  byQr: TapqrJourneyQrRow[];
}