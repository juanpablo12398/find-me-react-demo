-- Fictional, anonymous records. The sole published marker is a demonstration.
INSERT INTO public_sightings
    (id, reporter_id, area, category, description, estado_revision,
     legacy_public, received_at, ubicacion)
VALUES
    ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000009001',
     'North district', 'Community report', 'Fictional report awaiting review.',
     'RECIBIDO', false, '09:20', ST_SetSRID(ST_MakePoint(-58.45, -34.60), 4326)),
    ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000009002',
     'River district', 'Case update', 'Fictional report needing more context.',
     'REQUIERE_MAS_INFORMACION', false, '10:45', ST_SetSRID(ST_MakePoint(-58.42, -34.62), 4326)),
    ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000009003',
     'Central district', 'Community report', 'Fictional public unverified report.',
     'PUBLICADO_NO_VERIFICADO', true, '11:15', ST_SetSRID(ST_MakePoint(-58.40, -34.61), 4326)),
    ('00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000009004',
     'South district', 'Case update', 'Fictional report under review.',
     'EN_REVISION', false, '12:30', ST_SetSRID(ST_MakePoint(-58.44, -34.65), 4326))
ON CONFLICT (id) DO NOTHING;
