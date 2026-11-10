package dev.verdondoni.findme;

import java.time.Instant;
import java.util.UUID;

public record AuditEvent(UUID sightingId, UUID reviewerId, ReviewState before,
                         ReviewState after, String reason, Instant at) {}
