import React from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { demoApi } from "./api";

vi.mock("./api", () => ({
  demoApi: {
    reports: vi.fn(),
    audit: vi.fn(),
    review: vi.fn(),
    map: vi.fn(),
  },
}));
vi.mock("./MapPanel", () => ({
  default: ({ revision }) => <div>Connected map revision {revision}</div>,
}));

const id = (n) => `00000000-0000-4000-8000-000000000${n}`;
const reports = [
  { id: id(101), area: "North district", category: "Community report", state: "RECIBIDO", receivedAt: "09:20", description: "Fictional report one" },
  { id: id(102), area: "River district", category: "Case update", state: "REQUIERE_MAS_INFORMACION", receivedAt: "10:45", description: "Fictional report two" },
  { id: id(103), area: "Central district", category: "Community report", state: "PUBLICADO_NO_VERIFICADO", receivedAt: "11:15", description: "Fictional report three" },
  { id: id(104), area: "South district", category: "Case update", state: "EN_REVISION", receivedAt: "12:30", description: "Fictional report four" },
];

beforeEach(() => {
  vi.clearAllMocks();
  demoApi.reports.mockResolvedValue(reports.map((item) => ({ ...item })));
  demoApi.audit.mockResolvedValue([]);
  demoApi.review.mockImplementation(async (reportId, state) => ({
    ...reports.find((item) => item.id === reportId),
    state,
  }));
});

describe("Find Me connected public sample", () => {
  test("loads fictional queue from API and identifies unverified information", async () => {
    render(<App />);
    expect(await screen.findByRole("button", { name: /DEMO-101/ })).toBeInTheDocument();
    expect(demoApi.reports).toHaveBeenCalledOnce();
    expect(screen.getByText("4", { selector: ".stats strong" })).toBeInTheDocument();
    expect(screen.getByText("Unverified community information")).toBeInTheDocument();
    expect(screen.getByText(/cannot accept real reports/)).toBeInTheDocument();
  });

  test("search and status filter operate on server loaded records", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("button", { name: /DEMO-101/ });
    await user.type(screen.getByRole("textbox", { name: "Search records" }), "river");
    expect(screen.getByRole("button", { name: /DEMO-102/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /DEMO-101/ })).not.toBeInTheDocument();
    await user.selectOptions(screen.getByRole("combobox", { name: "Filter status" }), "PUBLICADO_NO_VERIFICADO");
    expect(screen.getByText("No fictional records match this filter.")).toBeInTheDocument();
  });

  test("publishing calls Spring API and updates the selected record", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("button", { name: /DEMO-101/ });
    await user.click(screen.getByRole("button", { name: "Publish unverified" }));
    expect(demoApi.review).toHaveBeenCalledWith(id(101), "PUBLICADO_NO_VERIFICADO", "Fictional review action");
    expect(await screen.findByText("0", { selector: ".stats strong" })).toBeInTheDocument();
    expect(within(document.querySelector(".detail-panel")).getByText("Public · unverified")).toBeInTheDocument();
  });

  test("request context then resume follows backend transition names", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("button", { name: /DEMO-101/ });
    await user.click(screen.getByRole("button", { name: "Request context" }));
    expect(demoApi.review).toHaveBeenCalledWith(id(101), "REQUIERE_MAS_INFORMACION", expect.any(String));
    await user.click(await screen.findByRole("button", { name: "Resume review" }));
    expect(demoApi.review).toHaveBeenLastCalledWith(id(101), "EN_REVISION", expect.any(String));
  });

  test("published record can be restricted", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("button", { name: /DEMO-103/ }));
    await user.click(screen.getByRole("button", { name: "Restrict" }));
    expect(demoApi.review).toHaveBeenCalledWith(id(103), "RESTRINGIDO", expect.any(String));
  });

  test("map section is reachable and receives revision after review", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("button", { name: /DEMO-101/ });
    await user.click(screen.getByRole("button", { name: "Publish unverified" }));
    await user.click(screen.getByRole("button", { name: /Public map/ }));
    expect(screen.getByText("Connected map revision 1")).toBeInTheDocument();
  });

  test("audit section displays refreshed server event", async () => {
    const user = userEvent.setup();
    demoApi.audit.mockResolvedValueOnce([]).mockResolvedValueOnce([
      { sightingId: id(101), before: "RECIBIDO", after: "PUBLICADO_NO_VERIFICADO", reason: "Fictional review action", at: "2024-01-01" },
    ]);
    render(<App />);
    await screen.findByRole("button", { name: /DEMO-101/ });
    await user.click(screen.getByRole("button", { name: "Publish unverified" }));
    await user.click(screen.getByRole("button", { name: /Audit trail/ }));
    expect(await screen.findByText(/Pending review → Public · unverified/)).toBeInTheDocument();
  });

  test("API errors are shown instead of pretending local state changed", async () => {
    const user = userEvent.setup();
    demoApi.review.mockRejectedValue(new Error("Review failed"));
    render(<App />);
    await screen.findByRole("button", { name: /DEMO-101/ });
    await user.click(screen.getByRole("button", { name: "Publish unverified" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Review failed");
    expect(within(document.querySelector(".detail-panel")).getByText("Pending review")).toBeInTheDocument();
  });

  test("unavailable backend is reported", async () => {
    demoApi.reports.mockRejectedValue(new Error("Demo API offline"));
    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Demo API offline");
  });
});
