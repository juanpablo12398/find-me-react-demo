import { beforeEach, expect, test, vi } from "vitest";
import { demoApi } from "./api";

beforeEach(() => vi.restoreAllMocks());

test("review uses the local demo endpoint and explicit demo header", async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: "demo", state: "EN_REVISION" }),
  });
  vi.stubGlobal("fetch", fetchMock);
  await demoApi.review("demo", "EN_REVISION", "Fictional review action");
  expect(fetchMock).toHaveBeenCalledWith("/api/demo/reports/demo/state", expect.objectContaining({
    method: "POST",
    headers: expect.objectContaining({ "X-Demo-Reviewer": "fictional-only" }),
    body: JSON.stringify({ state: "EN_REVISION", reason: "Fictional review action" }),
  }));
  vi.unstubAllGlobals();
});

test("map bounds become URL parameters", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
  vi.stubGlobal("fetch", fetchMock);
  await demoApi.map({ lngMin: -58.5, latMin: -34.7, lngMax: -58.4, latMax: -34.5 });
  expect(fetchMock.mock.calls[0][0]).toContain("lngMin=-58.5");
  vi.unstubAllGlobals();
});

test("server error is exposed to UI", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: false, status: 403, json: async () => ({ error: "Demo reviewer header required" }),
  }));
  await expect(demoApi.reports()).rejects.toThrow("Demo reviewer header required");
  vi.unstubAllGlobals();
});
