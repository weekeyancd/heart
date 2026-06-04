package com.heart.controller;

import com.heart.model.dto.CirculationPathDto;
import com.heart.model.dto.CirculationPathDto.EdgeDto;
import com.heart.model.dto.CirculationPathDto.NodeDto;
import com.heart.service.CirculationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CirculationController.class)
class CirculationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CirculationService service;

    @Test
    @DisplayName("GET /api/circulation returns all paths")
    void findAll_returnsPaths() throws Exception {
        CirculationPathDto dto = new CirculationPathDto("systemic-loop", "体循环", "Systemic Circulation",
            List.of(new NodeDto("left-ventricle", new double[]{0, 0.5, 0.3})),
            List.of(new EdgeDto("left-ventricle", "aorta", "oxy", 2.0, 0, 1.0)),
            1.0);
        when(service.findAll()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/circulation"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data[0].id").value("systemic-loop"))
            .andExpect(jsonPath("$.data[0].nodes[0].partId").value("left-ventricle"));
    }

    @Test
    @DisplayName("GET /api/circulation/{id} returns path when exists")
    void findById_existingPath_returnsPath() throws Exception {
        CirculationPathDto dto = new CirculationPathDto("systemic-loop", "体循环", "Systemic Circulation",
            List.of(), List.of(), 1.0);
        when(service.findById("systemic-loop")).thenReturn(Optional.of(dto));

        mockMvc.perform(get("/api/circulation/systemic-loop"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.id").value("systemic-loop"));
    }

    @Test
    @DisplayName("GET /api/circulation/{id} returns 404 when not found")
    void findById_missingPath_returns404() throws Exception {
        when(service.findById("nonexistent")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/circulation/nonexistent"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value("Circulation path not found: nonexistent"));
    }
}
