package dev.verdondoni.findme;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Public spatial query with ST_Within and a review-state predicate.
 */
@Repository
public class GeoSearchRepository {
    private static final String SQL = """
            SELECT id FROM public_sightings a
            WHERE a.ubicacion IS NOT NULL
              AND a.estado_revision = 'PUBLICADO_NO_VERIFICADO'
              AND ST_Within(
                    a.ubicacion,
                    ST_MakeEnvelope(?, ?, ?, ?, 4326)
                  )
            ORDER BY a.fecha_hora DESC
            """;

    private final JdbcTemplate jdbc;

    public GeoSearchRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<UUID> findPublicInBounds(double lngMin, double latMin,
                                         double lngMax, double latMax) {
        if (lngMin >= lngMax || latMin >= latMax
                || lngMin < -180 || lngMax > 180 || latMin < -90 || latMax > 90) {
            throw new IllegalArgumentException("invalid WGS84 bounds");
        }
        return jdbc.query(SQL, (rs, row) -> rs.getObject("id", UUID.class),
                lngMin, latMin, lngMax, latMax);
    }
}
