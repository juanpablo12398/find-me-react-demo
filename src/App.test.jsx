import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("Find Me public review demo", () => {
  test("starts with fictional, unpublished records and an unverified warning", () => {
    render(<App />);
    expect(screen.getByText("4", { selector: ".stats strong" })).toBeInTheDocument();
    expect(screen.getByText("0", { selector: ".stats strong" })).toBeInTheDocument();
    expect(screen.getByText("Unverified community information")).toBeInTheDocument();
    expect(screen.getByText(/cannot accept real reports/)).toBeInTheDocument();
  });

  test("search and status filter narrow the visible queue", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByRole("textbox", { name: "Search records" }), "river");
    expect(screen.getByRole("button", { name: /DEMO-102/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /DEMO-101/ })).not.toBeInTheDocument();
    await user.selectOptions(screen.getByRole("combobox", { name: "Filter status" }), "Reviewed");
    expect(screen.getByText("No fictional records match this filter.")).toBeInTheDocument();
  });

  test("review changes only the selected record and updates the pending count", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /DEMO-103/ }));
    await user.click(screen.getByRole("button", { name: "Mark reviewed" }));
    const detail = document.querySelector(".detail-panel");
    expect(within(detail).getByText("Reviewed")).toBeInTheDocument();
    expect(screen.getByText("1", { selector: ".stats strong" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /DEMO-101/ })).toHaveTextContent("Pending review");
  });

  test("requesting context keeps the record out of the reviewed state", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Request context" }));
    expect(document.querySelector(".detail-panel")).toHaveTextContent("Needs context");
    await user.selectOptions(screen.getByRole("combobox", { name: "Filter status" }), "Needs context");
    expect(screen.getByRole("button", { name: /DEMO-101/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /DEMO-102/ })).toBeInTheDocument();
  });
});
