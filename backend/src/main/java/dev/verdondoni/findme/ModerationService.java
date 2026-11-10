package dev.verdondoni.findme;

import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Instant;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Public moderation slice with injected persistence and audit boundary.
 */
@Service
public class ModerationService {
    public interface Store {
        Sighting get(UUID id);
        void save(Sighting sighting, AuditEvent event);
    }

    private static final Map<ReviewState, Set<ReviewState>> ALLOWED = transitions();
    private final Store store;
    private final Clock clock;

    public ModerationService(Store store, Clock clock) {
        this.store = store;
        this.clock = clock;
    }

    public Sighting changeState(UUID id, ReviewState next, String reason,
                                UUID reviewerId, boolean isAdmin) {
        if (!isAdmin || reviewerId == null) {
            throw new SecurityException("reviewer must be an administrator");
        }
        if (next == null || reason == null || reason.trim().length() < 5) {
            throw new IllegalArgumentException("state and reason are required");
        }
        Sighting current = store.get(id);
        if (current == null) {
            throw new IllegalArgumentException("sighting not found");
        }
        ReviewState before = current.state() == null ? ReviewState.RECIBIDO : current.state();
        if (before != next && !ALLOWED.getOrDefault(before, Set.of()).contains(next)) {
            throw new IllegalArgumentException("invalid state transition");
        }
        Sighting saved = current.withState(next);
        store.save(saved, new AuditEvent(id, reviewerId, before, next,
                reason.trim(), Instant.now(clock)));
        return saved;
    }

    private static Map<ReviewState, Set<ReviewState>> transitions() {
        EnumMap<ReviewState, Set<ReviewState>> map = new EnumMap<>(ReviewState.class);
        map.put(ReviewState.RECIBIDO, EnumSet.of(
                ReviewState.EN_REVISION, ReviewState.PUBLICADO_NO_VERIFICADO,
                ReviewState.RESTRINGIDO, ReviewState.OCULTO_POR_SEGURIDAD,
                ReviewState.DESCARTADO, ReviewState.ESCALADO_AUTORIDAD,
                ReviewState.REQUIERE_MAS_INFORMACION));
        map.put(ReviewState.EN_REVISION, EnumSet.of(
                ReviewState.REQUIERE_MAS_INFORMACION, ReviewState.PUBLICADO_NO_VERIFICADO,
                ReviewState.RESTRINGIDO, ReviewState.OCULTO_POR_SEGURIDAD,
                ReviewState.DESCARTADO, ReviewState.ESCALADO_AUTORIDAD));
        map.put(ReviewState.PUBLICADO_NO_VERIFICADO, EnumSet.of(
                ReviewState.RESTRINGIDO, ReviewState.OCULTO_POR_SEGURIDAD,
                ReviewState.DESCARTADO));
        map.put(ReviewState.RESTRINGIDO, EnumSet.of(ReviewState.EN_REVISION));
        map.put(ReviewState.REQUIERE_MAS_INFORMACION, EnumSet.of(ReviewState.EN_REVISION));
        return map;
    }
}
