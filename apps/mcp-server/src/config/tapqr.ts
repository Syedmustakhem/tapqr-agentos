function requiredEnv(
  name: string
): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

export interface TapQrConfig {
  apiBaseUrl: string;
  accessToken: string;
  businessId: string;
}

export function getTapQrConfig(): TapQrConfig {
  const apiBaseUrl =
    process.env.TAPQR_API_BASE_URL?.trim();

  if (!apiBaseUrl) {
    throw new Error(
      "Missing required environment variable: TAPQR_API_BASE_URL"
    );
  }

  return {
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ""),
    accessToken: requiredEnv(
      "TAPQR_ACCESS_TOKEN"
    ),
    businessId: requiredEnv(
      "TAPQR_BUSINESS_ID"
    )
  };
}