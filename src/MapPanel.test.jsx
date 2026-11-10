import React from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MapPanel from "./MapPanel";
import { demoApi } from "./api";

vi.mock("./api", () => ({ demoApi: { map: vi.fn() } }));
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  CircleMarker: ({ children }) => <div>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
  useMapEvents: () => {},
}));

beforeEach(() => vi.clearAllMocks());

test("map requests PostGIS bounds and displays only returned markers", async () => {
  demoApi.map.mockResolvedValue([{ id: "demo", area: "Fictional area", lat: -34.6, lng: -58.4 }]);
  render(<MapPanel revision={0} />);
  expect(await screen.findByText("1 public demo markers in view")).toBeInTheDocument();
  expect(screen.getByText("Fictional area")).toBeInTheDocument();
  expect(demoApi.map).toHaveBeenCalledWith(expect.objectContaining({ lngMin: -58.6, lngMax: -58.25 }));
});

test("map reports backend errors", async () => {
  demoApi.map.mockRejectedValue(new Error("Map API offline"));
  render(<MapPanel revision={0} />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Map API offline");
});
