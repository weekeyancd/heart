package com.heart.model.dto;

import java.util.List;
import java.util.Map;

public record ModelMetaDto(
    List<String> partIds,
    Map<String, ColorMappingDto> colorMapping,
    Map<String, List<String>> occlusionMap
) {
    public record ColorMappingDto(
        String base,
        String oxy,
        String deoxy
    ) {}
}
