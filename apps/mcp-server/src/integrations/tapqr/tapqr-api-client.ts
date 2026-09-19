import {
  AgentOsError
} from "../../errors/agentos-error.js";

import {
  getTapQrConfig
} from "../../config/tapqr.js";

export interface TapQrApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface TapQrBusiness {
  id: string;
  ownerId?: string;
  name: string;
  legalName?: string | null;
  displayName?: string | null;
  slug?: string | null;

  businessType?: string | null;
  industry?: string | null;
  category?: string | null;
  subcategory?: string | null;

  email?: string | null;
  phone?: string | null;
  website?: string | null;
  whatsapp?: string | null;

  logo?: string | null;
  coverImage?: string | null;
  description?: string | null;

  timezone?: string | null;
  currency?: string | null;
  language?: string | null;
  country?: string | null;

  status?: string | null;
  isVerified?: boolean;
  isPublished?: boolean;
  onboardingCompleted?: boolean;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export class TapQrApiClient {
  private readonly config =
    getTapQrConfig();

  private async request<T>(
    path: string,
    init: RequestInit = {}
  ): Promise<T> {
    const url =
      `${this.config.apiBaseUrl}${path}`;

    let response: Response;

    try {
      response = await fetch(url, {
        ...init,
        headers: {
          Accept: "application/json",
          Authorization:
            `Bearer ${this.config.accessToken}`,
          "X-Business-Id":
            this.config.businessId,
          ...(init.headers ?? {})
        }
      });
    } catch (error) {
      throw new AgentOsError(
        "UPSTREAM_UNAVAILABLE",
        "TapQR API is unavailable.",
        error
      );
    }

    let body: unknown;

    try {
      body = await response.json();
    } catch {
      body = undefined;
    }

    if (!response.ok) {
      if (
        response.status === 401
      ) {
        throw new AgentOsError(
          "AUTHENTICATION_FAILED",
          "TapQR API authentication failed."
        );
      }

      if (
        response.status === 403
      ) {
        throw new AgentOsError(
          "AUTHORIZATION_DENIED",
          "TapQR API denied access to the requested business."
        );
      }

      if (
        response.status === 404
      ) {
        throw new AgentOsError(
          "RESOURCE_NOT_FOUND",
          "TapQR business resource was not found."
        );
      }

      throw new AgentOsError(
        "UPSTREAM_UNAVAILABLE",
        "TapQR API returned an unexpected error.",
        {
          status: response.status,
          body
        }
      );
    }

    return body as T;
  }

  async getBusiness(): Promise<TapQrBusiness> {
    const result =
      await this.request<
        TapQrApiResponse<TapQrBusiness>
      >(
        `/api/businesses/${this.config.businessId}`
      );

    if (
      !result ||
      result.success !== true ||
      !result.data
    ) {
      throw new AgentOsError(
        "UPSTREAM_UNAVAILABLE",
        "TapQR returned an invalid business response."
      );
    }

    return result.data;
  }
}