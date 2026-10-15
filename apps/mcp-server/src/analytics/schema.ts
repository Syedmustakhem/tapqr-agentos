


import { z } from "zod";
export const getCampaignPerformanceInputSchema = {
  businessId: z
    .string()
    .trim()
    .min(
      1,
      "businessId is required."
    )
    .describe(
      "The TapQR business ID."
    ),

  campaignId: z
    .string()
    .trim()
    .min(
      1,
      "campaignId is required."
    )
    .describe(
      "The TapQR campaign ID."
    ),

  days: z
    .number()
    .int()
    .min(1)
    .max(365)
    .default(30)
    .describe(
      "Number of days to analyze. Must be between 1 and 365."
    )
};
export const getQrFunnelInputSchema = {
  businessId: z
    .string()
    .trim()
    .min(
      1,
      "businessId is required."
    )
    .describe(
      "The TapQR business ID whose QR journey should be analyzed."
    ),

  days: z
    .number()
    .int()
    .min(1)
    .max(365)
    .default(30)
    .describe(
      "Number of days to analyze. Must be between 1 and 365."
    )
    
};

export const getBusinessContextInputSchema = {
  businessId: z
    .string()
    .trim()
    .min(
      1,
      "businessId is required."
    )
    .describe(
      "The TapQR business ID whose context should be retrieved."
    )
};

export const getQrPerformanceInputSchema = {
  businessId: z
    .string()
    .trim()
    .min(1, "businessId is required.")
    .describe(
      "The TapQR business ID whose QR code performance should be analyzed."
    ),

  days: z
    .number()
    .int()
    .min(1)
    .max(365)
    .default(30)
    .describe(
      "Number of days to analyze, from 1 to 365."
    ),

  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .describe(
      "Maximum number of QR codes to return in each performance list."
    )
};

export const getGrowthActionPlanInputSchema = {
  businessId: z
    .string()
    .trim()
    .min(1, "businessId is required.")
    .describe("The TapQR business ID to analyze."),

  days: z
    .number()
    .int()
    .min(1)
    .max(365)
    .default(30)
    .describe("Number of days to analyze, from 1 to 365.")
};

