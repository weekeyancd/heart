package com.heart.controller;

import com.heart.model.dto.KnowledgeProgressDto;
import com.heart.service.KnowledgeProgressService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(KnowledgeProgressController.class)
class KnowledgeProgressControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private KnowledgeProgressService service;

    @Test
    @DisplayName("GET /api/progress/{userId} returns progress")
    void getProgress_returnsProgress() throws Exception {
        KnowledgeProgressDto dto = new KnowledgeProgressDto("user1", List.of("left-atrium"), 2, 14, 7.14);
        when(service.getProgress("user1")).thenReturn(dto);

        mockMvc.perform(get("/api/progress/user1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.userId").value("user1"))
            .andExpect(jsonPath("$.data.visitedParts[0]").value("left-atrium"));
    }

    @Test
    @DisplayName("POST /api/progress/{userId}/visit marks part as visited")
    void markVisited_savesVisit() throws Exception {
        mockMvc.perform(post("/api/progress/user1/visit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"partId\":\"left-atrium\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("PUT /api/progress/{userId}/guided-steps updates steps")
    void updateGuidedSteps_updatesSteps() throws Exception {
        mockMvc.perform(put("/api/progress/user1/guided-steps")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"stepsCompleted\":5}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("DELETE /api/progress/{userId} resets progress")
    void resetProgress_deletesProgress() throws Exception {
        mockMvc.perform(delete("/api/progress/user1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }
}
