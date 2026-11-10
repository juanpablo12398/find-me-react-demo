import React, { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { demoApi } from "./api";

const initialBounds = {
  lngMin: -58.6,
  latMin: -34.75,
  lngMax: -58.25,
  latMax: -34.45,
};

function BoundsWatcher({ onChange }) {
  useMapEvents({
    moveend(event) {
      const bounds = event.target.getBounds();
      onChange({
        lngMin: bounds.getWest(),
        latMin: bounds.getSouth(),
        lngMax: bounds.getEast(),
        latMax: bounds.getNorth(),
      });
    },
  });
  return null;
}

export default function MapPanel({ revision }) {
  const [bounds, setBounds] = useState(initialBounds);
  const [points, setPoints] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    demoApi
      .map(bounds)
      .then((data) => {
        if (active) {
          setPoints(data);
          setError("");
        }
      })
      .catch((failure) => {
        if (active) setError(failure.message);
      });
    return () => {
      active = false;
    };
  }, [bounds.lngMin, bounds.latMin, bounds.lngMax, bounds.latMax, revision]);

  return (
    <section className="map-panel" aria-label="Fictional map">
      <div className="panel-heading">
        <div>
          <h2>Public map</h2>
          <p>Only reviewed, unverified demo records are returned by PostGIS.</p>
        </div>
        <span className="badge">Fictional markers</span>
      </div>
      {error && <p role="alert">{error}</p>}
      <p aria-live="polite">{points.length} public demo markers in view</p>
      <MapContainer center={[-34.6, -58.43]} zoom={12} className="leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <BoundsWatcher onChange={setBounds} />
        {points.map((point) => (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={9}
            pathOptions={{ color: "#1f72ad", fillOpacity: 0.7 }}
          >
            <Popup>
              <strong>Fictional, unverified demo marker</strong>
              <br />
              {point.area}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <p className="caption">
        Map movement requests new bounds from the Spring Boot API. The project
        does not show real people or sightings.
      </p>
    </section>
  );
}
