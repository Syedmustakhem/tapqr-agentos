
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  TapqrApiClient,
  type TapqrBusiness,
} from "../../integrations/tapqr/index.js";

import {
  getBusinessContextInputSchema,
} from "../../analytics/schema.js";

function sanitizeBusiness(business: TapqrBusiness) {
  return {
    id: business.id,
    name: business.name,
    legalName: business.legalName,
    displayName: business.displayName,
    slug: business.slug,

    businessType: business.businessType,
    industry: business.industry,
    category: business.category,
    subcategory: business.subcategory,

    description: business.description,
    website: business.website,

    country: business.country,
    timezone: business.timezone,
    currency: business.currency,
    language: business.language,

    status: business.status,
    isVerified: business.isVerified,
    isPublished: business.isPublished,
    onboardingCompleted: business.onboardingCompleted,
  };
}

export function registerGetBusinessContextTool(
  server: McpServer
): void {
  server.registerTool(
    "get_business_context",
    {
      title: "Get Business Context",

      description:
        "Retrieve safe business context from TapQR for a specified " +
        "business. Returns business identity, classification, " +
        "localization, lifecycle, verification, and publishing " +
        "information. Sensitive contact fields and ownership details " +
        "are excluded from the tool output. Read-only.",

      inputSchema: getBusinessContextInputSchema,

      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },

    async ({ businessId }) => {
      const client = new TapqrApiClient();

      const business = await client.getBusiness(businessId);

      const output = {
        businessId,
        source: "TapQR business API",
        business: sanitizeBusiness(business),
        limitations: [
          "Only the business fields explicitly selected by this tool are returned.",
          "This tool does not independently verify business claims or verification status.",
          "The tool does not modify business data.",
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
