package dev.verdondoni.findme;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

/**
 * Public sample policy: review state is the source of truth.
 */
@Component
public class VisibilityPolicy {
    public boolean canView(Sighting sighting, UUID viewerId, boolean isAdmin) {
        return isAdmin
                || sighting.state() == ReviewState.PUBLICADO_NO_VERIFICADO
                || viewerId != null && viewerId.equals(sighting.reporterId());
    }

    public List<Sighting> visibleTo(List<Sighting> sightings, UUID viewerId, boolean isAdmin) {
        return sightings.stream().filter(s -> canView(s, viewerId, isAdmin)).toList();
    }

    public PublicSighting toPublic(Sighting sighting) {
        if (sighting.state() != ReviewState.PUBLICADO_NO_VERIFICADO) {
            throw new SecurityException("not public");
        }
        return new PublicSighting(sighting.id(), sighting.description(), sighting.state());
    }

    public record PublicSighting(UUID id, String description, ReviewState state) {}
}
