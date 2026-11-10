package dev.verdondoni.findme;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class VisibilityPolicyTest {
    private final VisibilityPolicy policy = new VisibilityPolicy();
    private final UUID reporter = UUID.randomUUID();
    private final UUID stranger = UUID.randomUUID();

    private Sighting sighting(ReviewState state, boolean legacyPublic) {
        return new Sighting(UUID.randomUUID(), reporter, state, legacyPublic, "Fictitious report");
    }

    @Test void publishedIsVisibleAnonymously() {
        assertTrue(policy.canView(sighting(ReviewState.PUBLICADO_NO_VERIFICADO, true), null, false));
    }

    @Test void receivedWithStalePublicFlagStaysHidden() {
        assertFalse(policy.canView(sighting(ReviewState.RECIBIDO, true), null, false));
    }

    @Test void restrictedWithStalePublicFlagStaysHidden() {
        assertFalse(policy.canView(sighting(ReviewState.RESTRINGIDO, true), stranger, false));
    }

    @Test void ownerCanViewOwnPendingReport() {
        assertTrue(policy.canView(sighting(ReviewState.RECIBIDO, false), reporter, false));
    }

    @Test void strangerCannotViewPendingReport() {
        assertFalse(policy.canView(sighting(ReviewState.RECIBIDO, false), stranger, false));
    }

    @Test void adminCanViewHiddenReport() {
        assertTrue(policy.canView(sighting(ReviewState.OCULTO_POR_SEGURIDAD, false), stranger, true));
    }

    @Test void publicProjectionOmitsReporterId() {
        var result = policy.toPublic(sighting(ReviewState.PUBLICADO_NO_VERIFICADO, true));
        assertEquals("Fictitious report", result.description());
        assertEquals(3, result.getClass().getRecordComponents().length);
    }

    @Test void privateReportCannotBeProjected() {
        assertThrows(SecurityException.class, () -> policy.toPublic(sighting(ReviewState.RECIBIDO, true)));
    }

    @Test void listFiltersPendingForStranger() {
        var visible = policy.visibleTo(List.of(
                sighting(ReviewState.RECIBIDO, true),
                sighting(ReviewState.PUBLICADO_NO_VERIFICADO, true)), stranger, false);
        assertEquals(1, visible.size());
        assertEquals(ReviewState.PUBLICADO_NO_VERIFICADO, visible.get(0).state());
    }
}
