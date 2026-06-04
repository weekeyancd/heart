package com.heart.controller;

import com.heart.model.dto.HeartPartDto;
import com.heart.model.dto.HeartPartDto.LayersDto;
import com.heart.model.dto.HeartPartDto.RelationsDto;
import com.heart.service.HeartPartService;
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

@WebMvcTest(HeartPartController.class)
class HeartPartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HeartPartService service;

    @Test
    @DisplayName("GET /api/parts returns all parts")
    void findAll_returnsParts() throws Exception {
        HeartPartDto dto = new HeartPartDto("left-atrium", "左心房", "Left Atrium", "chamber",
            new LayersDto("anatomy", "physiology", null),
            new RelationsDto(List.of(), List.of(), List.of(), List.of()),
            List.of(), "fun fact");
        when(service.findAll()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/parts"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data[0].id").value("left-atrium"))
            .andExpect(jsonPath("$.data[0].nameZh").value("左心房"));
    }

    @Test
    @DisplayName("GET /api/parts/{id} returns part when exists")
    void findById_existingPart_returnsPart() throws Exception {
        HeartPartDto dto = new HeartPartDto("left-atrium", "左心房", "Left Atrium", "chamber",
            new LayersDto("anatomy", "physiology", null),
            new RelationsDto(List.of(), List.of(), List.of(), List.of()),
            List.of(), "fun fact");
        when(service.findById("left-atrium")).thenReturn(Optional.of(dto));

        mockMvc.perform(get("/api/parts/left-atrium"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.id").value("left-atrium"));
    }

    @Test
    @DisplayName("GET /api/parts/{id} returns 404 when not found")
    void findById_missingPart_returns404() throws Exception {
        when(service.findById("nonexistent")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/parts/nonexistent"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error").value("Part not found: nonexistent"));
    }
}
