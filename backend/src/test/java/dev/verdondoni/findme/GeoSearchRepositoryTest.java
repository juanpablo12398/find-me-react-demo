package dev.verdondoni.findme;

import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

class GeoSearchRepositoryTest {
    @Test void invalidBoundsDoNotReachDatabase() {
        var repo = new GeoSearchRepository(null);
        assertThrows(IllegalArgumentException.class, () -> repo.findPublicInBounds(1, 0, -1, 2));
        assertThrows(IllegalArgumentException.class, () -> repo.findPublicInBounds(-181, 0, 1, 2));
        assertThrows(IllegalArgumentException.class, () -> repo.findPublicInBounds(0, 90, 1, 91));
    }

    @Test void actualRepositoryQueryRunsAgainstPostgisWhenConfigured() {
        String url = System.getenv("POSTGIS_JDBC_URL");
        assumeTrue(url != null && !url.isBlank(), "requires POSTGIS_JDBC_URL; CI supplies PostGIS");
        var dataSource = new DriverManagerDataSource(url, "postgres", "postgres");
        var jdbc = new JdbcTemplate(dataSource);
        jdbc.execute("CREATE EXTENSION IF NOT EXISTS postgis");
        jdbc.execute("DROP TABLE IF EXISTS public_sightings");
        jdbc.execute("""
                CREATE TABLE public_sightings (
                    id UUID PRIMARY KEY,
                    estado_revision TEXT NOT NULL,
                    ubicacion geometry(Point, 4326),
                    fecha_hora timestamptz NOT NULL DEFAULT now()
                )
                """);
        UUID publicInside = UUID.randomUUID();
        UUID pendingInside = UUID.randomUUID();
        UUID publicOutside = UUID.randomUUID();
        insert(jdbc, publicInside, "PUBLICADO_NO_VERIFICADO", -58.45, -34.60);
        insert(jdbc, pendingInside, "RECIBIDO", -58.46, -34.61);
        insert(jdbc, publicOutside, "PUBLICADO_NO_VERIFICADO", -70.0, -40.0);

        List<UUID> results = new GeoSearchRepository(jdbc)
                .findPublicInBounds(-58.5, -34.7, -58.4, -34.5);
        assertEquals(List.of(publicInside), results);
    }

    private void insert(JdbcTemplate jdbc, UUID id, String state, double lng, double lat) {
        jdbc.update("""
                INSERT INTO public_sightings(id, estado_revision, ubicacion)
                VALUES (?, ?, ST_SetSRID(ST_MakePoint(?, ?), 4326))
                """, id, state, lng, lat);
    }
}
