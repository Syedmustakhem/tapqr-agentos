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
export interface TapqrBusinessOverview {
  period: TapqrJourneyPeriod;
  overview: {
    totalScans: number;
    uniqueVisitors: number;
    previousPeriodScans: number;
    percentageChange: number;
    activeQrCodes: number;
    totalQrCodes: number;
    averageDailyScans: number;
    totalConversions: number;
    uniqueConverters: number;
    conversionRate: number;
    previousPeriodConversions: number;
    conversionPercentageChange: number;
  };
  scansByDay: Array<{
    date: string;
    scans: number;
  }>;
  qrPerformance: Array<{
    id: string;
    name: string;
    shortCode: string;
    scanCount: number;
    status: string;
    type: string;
    experienceType: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
export interface TapqrBusiness {
  id: string;
  ownerId: string;
  name: string;
  legalName: string | null;
  displayName: string | null;
  slug: string;
  businessType: string | null;
  industry: string | null;
  category: string | null;
  subcategory: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  whatsapp: string | null;
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  timezone: string;
  currency: string;
  language: string;
  country: string;
  status: string;
  isVerified: boolean;
  isPublished: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}