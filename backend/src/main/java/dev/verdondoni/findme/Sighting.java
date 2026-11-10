package dev.verdondoni.findme;

import java.util.UUID;

/** Fictitious sample records only; no person names, photos or coordinates. */
public record Sighting(
        UUID id,
        UUID reporterId,
        ReviewState state,
        boolean legacyPublic,
        String description
) {
    public Sighting withState(ReviewState next) {
        return new Sighting(id, reporterId, next,
                next == ReviewState.PUBLICADO_NO_VERIFICADO, description);
    }
}
