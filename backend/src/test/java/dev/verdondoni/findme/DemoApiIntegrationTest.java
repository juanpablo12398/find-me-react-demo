package dev.verdondoni.findme;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@EnabledIfEnvironmentVariable(named = "POSTGIS_JDBC_URL", matches = ".+")
class DemoApiIntegrationTest {
    @Autowired MockMvc mvc;

    @Test void reviewUpdatesDatabaseAuditAndPublicMap() throws Exception {
        mvc.perform(get("/api/demo/reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4));

        String map = "/api/demo/map?lngMin=-58.5&latMin=-34.7&lngMax=-58.3&latMax=-34.5";
        mvc.perform(get(map))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        mvc.perform(post("/api/demo/reports/00000000-0000-4000-8000-000000000101/state")
                        .header("X-Demo-Reviewer", "fictional-only")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"state\":\"PUBLICADO_NO_VERIFICADO\",\"reason\":\"Reviewed fictional report\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.state").value("PUBLICADO_NO_VERIFICADO"));

        mvc.perform(get(map))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
        mvc.perform(get("/api/demo/audit"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].before").value("RECIBIDO"))
                .andExpect(jsonPath("$[0].after").value("PUBLICADO_NO_VERIFICADO"));
    }

    @Test void reviewRequiresExplicitDemoHeader() throws Exception {
        mvc.perform(post("/api/demo/reports/00000000-0000-4000-8000-000000000104/state")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"state\":\"RESTRINGIDO\",\"reason\":\"Safety reason\"}"))
                .andExpect(status().isForbidden());
    }
}
