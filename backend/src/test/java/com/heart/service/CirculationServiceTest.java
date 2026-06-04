package com.heart.service;

import com.heart.model.dto.CirculationPathDto;
import com.heart.model.entity.CirculationEdgeEntity;
import com.heart.model.entity.CirculationNodeEntity;
import com.heart.model.entity.CirculationPathEntity;
import com.heart.repository.CirculationPathRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CirculationServiceTest {

    @Mock
    private CirculationPathRepository repository;

    private CirculationService service;

    private CirculationPathEntity systemicLoop;

    @BeforeEach
    void setUp() {
        service = new CirculationService(repository);

        systemicLoop = new CirculationPathEntity("systemic-loop", "体循环", "Systemic Circulation", 1.0);
        CirculationNodeEntity node = new CirculationNodeEntity(systemicLoop, "left-ventricle", 0, 0.5, 0.3);
        CirculationEdgeEntity edge = new CirculationEdgeEntity(systemicLoop, "left-ventricle", "aorta", "oxy", 2.0, 0, 1.0);
        systemicLoop.getNodes().add(node);
        systemicLoop.getEdges().add(edge);
    }

    @Test
    @DisplayName("findAll returns all circulation paths with nodes and edges")
    void findAll_returnsAllPaths() {
        when(repository.findAllWithNodesAndEdges()).thenReturn(List.of(systemicLoop));

        List<CirculationPathDto> result = service.findAll();

        assertThat(result).hasSize(1);
        CirculationPathDto dto = result.get(0);
        assertThat(dto.id()).isEqualTo("systemic-loop");
        assertThat(dto.nodes()).hasSize(1);
        assertThat(dto.edges()).hasSize(1);
    }

    @Test
    @DisplayName("findById returns path when exists")
    void findById_existingPath_returnsPath() {
        when(repository.findByIdWithNodesAndEdges("systemic-loop")).thenReturn(Optional.of(systemicLoop));

        Optional<CirculationPathDto> result = service.findById("systemic-loop");

        assertThat(result).isPresent();
        assertThat(result.get().id()).isEqualTo("systemic-loop");
    }

    @Test
    @DisplayName("findById returns empty when not found")
    void findById_missingPath_returnsEmpty() {
        when(repository.findByIdWithNodesAndEdges("nonexistent")).thenReturn(Optional.empty());

        Optional<CirculationPathDto> result = service.findById("nonexistent");

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("toDto maps node and edge fields correctly")
    void toDto_mapsFieldsCorrectly() {
        when(repository.findAllWithNodesAndEdges()).thenReturn(List.of(systemicLoop));

        List<CirculationPathDto> result = service.findAll();
        CirculationPathDto dto = result.get(0);

        assertThat(dto.nodes().get(0).partId()).isEqualTo("left-ventricle");
        assertThat(dto.nodes().get(0).position()).containsExactly(0.0, 0.5, 0.3);
        assertThat(dto.edges().get(0).from()).isEqualTo("left-ventricle");
        assertThat(dto.edges().get(0).direction()).isEqualTo("oxy");
        assertThat(dto.edges().get(0).oxygenLevel()).isEqualTo(1.0);
    }
}
