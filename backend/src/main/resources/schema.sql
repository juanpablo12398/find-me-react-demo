CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS public_sightings (
    id UUID PRIMARY KEY,
    reporter_id UUID NOT NULL,
    area TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    estado_revision TEXT NOT NULL,
    legacy_public BOOLEAN NOT NULL DEFAULT FALSE,
    received_at TEXT NOT NULL,
    fecha_hora TIMESTAMPTZ NOT NULL DEFAULT now(),
    ubicacion geometry(Point, 4326)
);

CREATE TABLE IF NOT EXISTS public_audit (
    id BIGSERIAL PRIMARY KEY,
    sighting_id UUID NOT NULL REFERENCES public_sightings(id),
    reviewer_id UUID NOT NULL,
    state_before TEXT NOT NULL,
    state_after TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);
