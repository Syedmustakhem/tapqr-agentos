


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