package com.heart.service;

import com.heart.model.dto.ModelMetaDto;
import com.heart.model.entity.HeartPartEntity;
import com.heart.repository.HeartPartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ModelMetaServiceTest {

    @Mock
    private HeartPartRepository repository;

    private ModelMetaService service;

    @BeforeEach
    void setUp() {
        service = new ModelMetaService(repository);
    }

    @Test
    @DisplayName("getModelMeta returns part IDs from repository")
    void getModelMeta_returnsPartIds() {
        when(repository.findAll()).thenReturn(List.of(
            new HeartPartEntity("left-atrium", "左心房", "Left Atrium", "chamber",
                "a", "p", null, List.of(), List.of(), List.of(), List.of(), List.of(), "f"),
            new HeartPartEntity("aorta", "主动脉", "Aorta", "vessel",
                "a", "p", null, List.of(), List.of(), List.of(), List.of(), List.of(), "f")
        ));

        ModelMetaDto result = service.getModelMeta();

        assertThat(result.partIds()).containsExactly("left-atrium", "aorta");
    }

    @Test
    @DisplayName("getModelMeta includes color mapping for all 14 parts")
    void getModelMeta_includesColorMapping() {
        when(repository.findAll()).thenReturn(List.of());

        ModelMetaDto result = service.getModelMeta();

        assertThat(result.colorMapping()).hasSize(14);
        assertThat(result.colorMapping().get("left-atrium").base()).isEqualTo("#e74c3c");
    }

    @Test
    @DisplayName("getModelMeta includes occlusion map")
    void getModelMeta_includesOcclusionMap() {
        when(repository.findAll()).thenReturn(List.of());

        ModelMetaDto result = service.getModelMeta();

        assertThat(result.occlusionMap()).hasSize(8);
        assertThat(result.occlusionMap().get("left-ventricle")).containsExactly("septum", "left-atrium");
    }
}
