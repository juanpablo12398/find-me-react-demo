const base = "/api/demo";

async function request(path, options) {
  const response = await fetch(base + path, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || `Demo API returned ${response.status}`);
  }
  return body;
}

export const demoApi = {
  reports: () => request("/reports"),
  audit: () => request("/audit"),
  map: ({ lngMin, latMin, lngMax, latMax }) =>
    request(
      `/map?${new URLSearchParams({ lngMin, latMin, lngMax, latMax })}`,
    ),
  review: (id, state, reason) =>
    request(`/reports/${id}/state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Demo-Reviewer": "fictional-only",
      },
      body: JSON.stringify({ state, reason }),
    }),
};
