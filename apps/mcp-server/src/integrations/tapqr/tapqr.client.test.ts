
import { afterEach, describe, expect, it, vi } from "vitest";
import { TapqrApiClient } from "./tapqr.client.js";

describe("TapqrApiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("does not make a request when the API token is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const client = new TapqrApiClient({
      accessToken: "",
    });

    await expect(client.getBusiness("business-1")).rejects.toThrow(
      "TapQR API credentials are not configured."
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    [401, "TapQR authentication failed."],
    [
      403,
      "The authenticated user is not authorized to access this TapQR resource.",
    ],
    [404, "The requested TapQR resource was not found."],
    [400, "TapQR rejected the requested input."],
    [500, "TapQR returned HTTP 500."],
  ])("handles HTTP %i responses safely", async (status, message) => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("{}", { status })
      )
    );

    const client = new TapqrApiClient({
      accessToken: "test-token",
    });

    await expect(client.getBusiness("business-1")).rejects.toThrow(
      message
    );
  });

  it("handles invalid JSON responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("not-json", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    const client = new TapqrApiClient({
      accessToken: "test-token",
    });

    await expect(client.getBusiness("business-1")).rejects.toThrow(
      "TapQR returned an invalid JSON response."
    );
  });

  it("handles upstream timeouts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(
        new DOMException("Request aborted", "AbortError")
      )
    );

    const client = new TapqrApiClient({
      accessToken: "test-token",
    });

    await expect(client.getBusiness("business-1")).rejects.toThrow(
      "TapQR request timed out."
    );
  });

  it("handles upstream connection failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Connection refused"))
    );

    const client = new TapqrApiClient({
      accessToken: "test-token",
    });

    await expect(client.getBusiness("business-1")).rejects.toThrow(
      "TapQR could not be reached."
    );
  });
});
