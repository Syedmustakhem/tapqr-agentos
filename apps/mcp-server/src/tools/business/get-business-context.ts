import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { TapqrApiClient } from "../../integrations/tapqr/index.js";
import { getBusinessContextInputSchema } from "../../analytics/schema.js";

import type { TapqrBusiness } from "../../integrations/tapqr/index.js";

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
        "Retrieve the TapQR business context for a business. " +
        "Returns safe business identity, classification, localization, " +
        "lifecycle, verification, and publishing information. " +
        "This tool is read-only and does not modify business data.",

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
        business: sanitizeBusiness(business),
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output, null, 2),
          },
        ],

        structuredContent: output,
      };
    }
  );
}
