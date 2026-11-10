package dev.verdondoni.findme;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

/** PostgreSQL persistence for fictional sample records only. */
@Repository
public class DemoStore implements ModerationService.Store {
    private final JdbcTemplate jdbc;

    public DemoStore(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Sighting get(UUID id) {
        List<Sighting> found = jdbc.query("""
                SELECT id, reporter_id, estado_revision, legacy_public, description
                FROM public_sightings WHERE id = ?
                """, DemoStore::sighting, id);
        return found.isEmpty() ? null : found.get(0);
    }

    @Override
    public void save(Sighting sighting, AuditEvent event) {
        jdbc.update("""
                UPDATE public_sightings SET estado_revision = ?, legacy_public = ?
                WHERE id = ?
                """, sighting.state().name(), sighting.legacyPublic(), sighting.id());
        jdbc.update("""
                INSERT INTO public_audit
                    (sighting_id, reviewer_id, state_before, state_after, reason, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """, event.sightingId(), event.reviewerId(), event.before().name(),
                event.after().name(), event.reason(), event.at());
    }

    public List<DemoReport> listReports() {
        return jdbc.query("""
                SELECT id, area, category, description, estado_revision, received_at
                FROM public_sightings ORDER BY received_at
                """, (rs, row) -> new DemoReport(
                rs.getObject("id", UUID.class),
                rs.getString("area"),
                rs.getString("category"),
                rs.getString("description"),
                ReviewState.valueOf(rs.getString("estado_revision")),
                rs.getString("received_at")));
    }

    public List<MapPoint> mapPoints(List<UUID> ids) {
        if (ids.isEmpty()) return List.of();
        String placeholders = String.join(",", java.util.Collections.nCopies(ids.size(), "?"));
        return jdbc.query("""
                SELECT id, area, ST_Y(ubicacion) AS lat, ST_X(ubicacion) AS lng
                FROM public_sightings WHERE id IN (""" + placeholders + ")",
                (rs, row) -> new MapPoint(rs.getObject("id", UUID.class),
                        rs.getString("area"), rs.getDouble("lat"), rs.getDouble("lng")),
                ids.toArray());
    }

    public List<DemoAudit> listAudit() {
        return jdbc.query("""
                SELECT sighting_id, state_before, state_after, reason, created_at
                FROM public_audit ORDER BY created_at DESC
                """, (rs, row) -> new DemoAudit(
                rs.getObject("sighting_id", UUID.class),
                rs.getString("state_before"),
                rs.getString("state_after"),
                rs.getString("reason"),
                rs.getTimestamp("created_at").toInstant().toString()));
    }

    private static Sighting sighting(ResultSet rs, int row) throws SQLException {
        return new Sighting(
                rs.getObject("id", UUID.class),
                rs.getObject("reporter_id", UUID.class),
                ReviewState.valueOf(rs.getString("estado_revision")),
                rs.getBoolean("legacy_public"),
                rs.getString("description"));
    }

    public record DemoReport(UUID id, String area, String category, String description,
                             ReviewState state, String receivedAt) {}
    public record MapPoint(UUID id, String area, double lat, double lng) {}
    public record DemoAudit(UUID sightingId, String before, String after,
                            String reason, String at) {}
}
