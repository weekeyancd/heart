package com.heart.service;

import com.heart.model.dto.HeartPartDto;
import com.heart.model.entity.HeartPartEntity;
import com.heart.repository.HeartPartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HeartPartServiceTest {

    @Mock
    private HeartPartRepository repository;

    private HeartPartService service;

    private HeartPartEntity leftAtrium;

    @BeforeEach
    void setUp() {
        service = new HeartPartService(repository);
        leftAtrium = new HeartPartEntity(
            "left-atrium", "左心房", "Left Atrium", "chamber",
            "anatomy text", "physiology text", null,
            List.of("mitral-valve"), List.of("left-ventricle"),
            List.of("pulmonary-vein"), List.of(),
            List.of("pulmonary-loop", "systemic-loop"), "fun fact"
        );
    }

    @Test
    @DisplayName("findAll returns all parts as DTOs")
    void findAll_returnsAllParts() {
        when(repository.findAll()).thenReturn(List.of(leftAtrium));

        List<HeartPartDto> result = service.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo("left-atrium");
        assertThat(result.get(0).nameZh()).isEqualTo("左心房");
        assertThat(result.get(0).layers().anatomy()).isEqualTo("anatomy text");
        assertThat(result.get(0).relations().connectsTo()).containsExactly("mitral-valve");
    }

    @Test
    @DisplayName("findById returns part when exists")
    void findById_existingPart_returnsPart() {
        when(repository.findById("left-atrium")).thenReturn(Optional.of(leftAtrium));

        Optional<HeartPartDto> result = service.findById("left-atrium");

        assertThat(result).isPresent();
        assertThat(result.get().id()).isEqualTo("left-atrium");
    }

    @Test
    @DisplayName("findById returns empty when not found")
    void findById_missingPart_returnsEmpty() {
        when(repository.findById("nonexistent")).thenReturn(Optional.empty());

        Optional<HeartPartDto> result = service.findById("nonexistent");

        assertThat(result).isEmpty();
    }
}
