import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  TapQrApiClient
} from "../../integrations/tapqr/tapqr-api-client.js";

const inputSchema = {
  input: z.object({})
};

function sanitizeBusiness(
  business: Awaited<
    ReturnType<TapQrApiClient["getBusiness"]>
  >
) {
  return {
    id: business.id,
    name: business.name,
    legalName:
      business.legalName ?? null,
    displayName:
      business.displayName ?? null,
    slug:
      business.slug ?? null,

    businessType:
      business.businessType ?? null,
    industry:
      business.industry ?? null,
    category:
      business.category ?? null,
    subcategory:
      business.subcategory ?? null,

    description:
      business.description ?? null,

    website:
      business.website ?? null,

    country:
      business.country ?? null,
    timezone:
      business.timezone ?? null,
    currency:
      business.currency ?? null,
    language:
      business.language ?? null,

    status:
      business.status ?? null,

    isVerified:
      business.isVerified ?? false,

    isPublished:
      business.isPublished ?? false,

    onboardingCompleted:
      business.onboardingCompleted ?? false
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
        "Read the authenticated TapQR business context. Returns safe business identity, classification, localization, lifecycle, verification, and publishing information. This tool is read-only and has no side effects.",

      inputSchema,

      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },

    async () => {
      const client =
        new TapQrApiClient();

      const business =
        await client.getBusiness();

      const safeBusiness =
        sanitizeBusiness(business);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                business:
                  safeBusiness,

                source:
                  "tapqr-api",

                sideEffects:
                  false
              }
            )
          }
        ]
      };
    }
  );
}