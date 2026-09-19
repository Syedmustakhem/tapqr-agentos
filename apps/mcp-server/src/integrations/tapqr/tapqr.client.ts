import {
  AgentOsError
} from "../../errors/agentos-error.js";

import { env } from "../../config/env.js";

import {
  extractCampaignPerformance,
  extractJourneyAnalytics
} from "./tapqr.parsers.js";

import type {
  TapqrCampaignPerformance,
  TapqrJourneyAnalytics
} from "./tapqr.types.js";

export interface TapqrApiClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
  accessToken?: string | undefined;
}

export class TapqrApiClient {
  private readonly baseUrl: string;

  private readonly timeoutMs: number;

  private readonly accessToken: string | undefined;

  constructor(
    options: TapqrApiClientOptions = {}
  ) {
    this.baseUrl =
      options.baseUrl ??
      env.TAPQR_API_BASE_URL;

    this.timeoutMs =
      options.timeoutMs ??
      env.TAPQR_API_TIMEOUT_MS;

    this.accessToken =
      options.accessToken ??
      env.TAPQR_API_TOKEN;
  }

  private buildHeaders(): Headers {
    const headers = new Headers();

    headers.set(
      "Accept",
      "application/json"
    );

    if (this.accessToken) {
      headers.set(
        "Authorization",
        `Bearer ${this.accessToken}`
      );
    }

    return headers;
  }

  private async request(
    path: string
  ): Promise<unknown> {
    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => controller.abort(),
        this.timeoutMs
      );

    try {
      const response = await fetch(
        `${this.baseUrl}${path}`,
        {
          method: "GET",
          headers: this.buildHeaders(),
          signal: controller.signal
        }
      );

      if (response.status === 401) {
        throw new AgentOsError(
          "AUTHENTICATION_FAILED",
          "TapQR authentication failed."
        );
      }

      if (response.status === 403) {
        throw new AgentOsError(
          "AUTHORIZATION_DENIED",
          "The authenticated user is not authorized to access this TapQR resource."
        );
      }

      if (response.status === 404) {
        throw new AgentOsError(
          "RESOURCE_NOT_FOUND",
          "The requested TapQR resource was not found."
        );
      }

      if (response.status === 400) {
        throw new AgentOsError(
          "INVALID_INPUT",
          "TapQR rejected the requested input."
        );
      }

      if (!response.ok) {
        throw new AgentOsError(
          "UPSTREAM_UNAVAILABLE",
          `TapQR returned HTTP ${response.status}.`
        );
      }

      try {
        return await response.json();
      } catch {
        throw new AgentOsError(
          "INTERNAL_ERROR",
          "TapQR returned an invalid JSON response."
        );
      }
    } catch (error) {
      if (error instanceof AgentOsError) {
        throw error;
      }

      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        throw new AgentOsError(
          "UPSTREAM_UNAVAILABLE",
          "TapQR request timed out."
        );
      }

      throw new AgentOsError(
        "UPSTREAM_UNAVAILABLE",
        "TapQR could not be reached."
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  async getQrJourneyAnalytics(
    businessId: string,
    days: number
  ): Promise<TapqrJourneyAnalytics> {
    const encodedBusinessId =
      encodeURIComponent(
        businessId
      );

    const encodedDays =
      encodeURIComponent(
        String(days)
      );

    const payload =
      await this.request(
        `/api/analytics/business/${encodedBusinessId}/journey?days=${encodedDays}`
      );

    return extractJourneyAnalytics(
      payload
    );
  }

  async getCampaignPerformance(
    businessId: string,
    campaignId: string,
    days: number
  ): Promise<TapqrCampaignPerformance> {
    const encodedBusinessId =
      encodeURIComponent(
        businessId
      );

    const encodedCampaignId =
      encodeURIComponent(
        campaignId
      );

    const encodedDays =
      encodeURIComponent(
        String(days)
      );

    const payload =
      await this.request(
        `/api/analytics/business/${encodedBusinessId}/campaigns/${encodedCampaignId}?days=${encodedDays}`
      );

    return extractCampaignPerformance(
      payload
    );
  }
}