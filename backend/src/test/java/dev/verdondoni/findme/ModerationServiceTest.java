package dev.verdondoni.findme;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ModerationServiceTest {
    private final UUID id = UUID.randomUUID();
    private final UUID reporter = UUID.randomUUID();
    private final UUID admin = UUID.randomUUID();
    private MemoryStore store;
    private ModerationService service;

    static class MemoryStore implements ModerationService.Store {
        Sighting sighting;
        List<AuditEvent> events = new ArrayList<>();
        public Sighting get(UUID id) {
            return sighting != null && sighting.id().equals(id) ? sighting : null;
        }
        public void save(Sighting sighting, AuditEvent event) {
            this.sighting = sighting;
            events.add(event);
        }
    }

    @BeforeEach
    void setup() {
        store = new MemoryStore();
        store.sighting = new Sighting(id, reporter, ReviewState.RECIBIDO, false, "Fictitious report");
        service = new ModerationService(store,
                Clock.fixed(Instant.parse("2024-01-01T00:00:00Z"), ZoneOffset.UTC));
    }

    @Test void adminCanPublishAndAudit() {
        Sighting result = service.changeState(id, ReviewState.PUBLICADO_NO_VERIFICADO,
                "Reviewed report", admin, true);
        assertTrue(result.legacyPublic());
        assertEquals(ReviewState.PUBLICADO_NO_VERIFICADO, result.state());
        assertEquals(1, store.events.size());
        assertEquals(ReviewState.RECIBIDO, store.events.get(0).before());
        assertEquals(ReviewState.PUBLICADO_NO_VERIFICADO, store.events.get(0).after());
        assertEquals(admin, store.events.get(0).reviewerId());
        assertEquals("Reviewed report", store.events.get(0).reason());
    }

    @Test void publicReportCanBeRestricted() {
        service.changeState(id, ReviewState.PUBLICADO_NO_VERIFICADO, "Reviewed report", admin, true);
        Sighting restricted = service.changeState(id, ReviewState.RESTRINGIDO, "Safety reason", admin, true);
        assertFalse(restricted.legacyPublic());
        assertEquals(2, store.events.size());
    }

    @Test void rejectedTransitionDoesNotSave() {
        service.changeState(id, ReviewState.RESTRINGIDO, "Safety reason", admin, true);
        assertThrows(IllegalArgumentException.class, () ->
                service.changeState(id, ReviewState.PUBLICADO_NO_VERIFICADO, "Reviewed report", admin, true));
        assertEquals(1, store.events.size());
    }

    @Test void nonAdminCannotChangeState() {
        assertThrows(SecurityException.class, () ->
                service.changeState(id, ReviewState.PUBLICADO_NO_VERIFICADO, "Reviewed report", reporter, false));
        assertTrue(store.events.isEmpty());
    }

    @Test void missingReviewerRejected() {
        assertThrows(SecurityException.class, () ->
                service.changeState(id, ReviewState.EN_REVISION, "Reviewing now", null, true));
    }

    @Test void shortReasonRejected() {
        assertThrows(IllegalArgumentException.class, () ->
                service.changeState(id, ReviewState.EN_REVISION, "bad", admin, true));
    }

    @Test void missingStateRejected() {
        assertThrows(IllegalArgumentException.class, () ->
                service.changeState(id, null, "Reviewed report", admin, true));
    }

    @Test void missingSightingRejected() {
        assertThrows(IllegalArgumentException.class, () ->
                service.changeState(UUID.randomUUID(), ReviewState.EN_REVISION, "Reviewed report", admin, true));
    }

    @Test void allPrivateDestinationsRemainHidden() {
        for (ReviewState target : List.of(ReviewState.RESTRINGIDO, ReviewState.OCULTO_POR_SEGURIDAD,
                ReviewState.DESCARTADO, ReviewState.ESCALADO_AUTORIDAD,
                ReviewState.REQUIERE_MAS_INFORMACION)) {
            setup();
            assertFalse(service.changeState(id, target, "Reviewed report", admin, true).legacyPublic());
        }
    }

    @Test void receivedToReviewAndBackForMoreInformation() {
        service.changeState(id, ReviewState.EN_REVISION, "Reviewing now", admin, true);
        service.changeState(id, ReviewState.REQUIERE_MAS_INFORMACION, "More detail needed", admin, true);
        assertEquals(ReviewState.EN_REVISION,
                service.changeState(id, ReviewState.EN_REVISION, "Returned to review", admin, true).state());
    }
}
