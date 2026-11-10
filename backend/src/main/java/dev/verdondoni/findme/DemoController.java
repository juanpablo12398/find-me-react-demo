package dev.verdondoni.findme;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/** Local demo endpoints. Only synthetic seed rows can be changed. */
@RestController
@RequestMapping("/api/demo")
public class DemoController {
    private static final UUID DEMO_REVIEWER =
            UUID.nameUUIDFromBytes("fictional-reviewer".getBytes(StandardCharsets.UTF_8));

    private final DemoStore store;
    private final ModerationService moderation;
    private final GeoSearchRepository geo;

    public DemoController(DemoStore store, ModerationService moderation, GeoSearchRepository geo) {
        this.store = store;
        this.moderation = moderation;
        this.geo = geo;
    }

    @GetMapping("/reports")
    public List<DemoStore.DemoReport> reports() {
        return store.listReports();
    }

    @PostMapping("/reports/{id}/state")
    public DemoStore.DemoReport review(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Demo-Reviewer", required = false) String reviewer,
            @RequestBody ReviewRequest request) {
        if (!"fictional-only".equals(reviewer)) {
            throw new SecurityException("demo reviewer header required");
        }
        moderation.changeState(id, request.state(), request.reason(), DEMO_REVIEWER, true);
        return store.listReports().stream().filter(item -> item.id().equals(id))
                .findFirst().orElseThrow();
    }

    @GetMapping("/map")
    public List<DemoStore.MapPoint> map(
            @RequestParam double lngMin, @RequestParam double latMin,
            @RequestParam double lngMax, @RequestParam double latMax) {
        return store.mapPoints(geo.findPublicInBounds(lngMin, latMin, lngMax, latMax));
    }

    @GetMapping("/audit")
    public List<DemoStore.DemoAudit> audit() {
        return store.listAudit();
    }

    @ExceptionHandler(SecurityException.class)
    ResponseEntity<Map<String, String>> forbidden(SecurityException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Map<String, String>> invalid(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("error", exception.getMessage()));
    }

    public record ReviewRequest(ReviewState state, String reason) {}
}
