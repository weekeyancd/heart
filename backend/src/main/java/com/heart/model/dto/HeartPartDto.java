package com.heart.model.dto;

import java.util.List;

public record HeartPartDto(
    String id,
    String nameZh,
    String nameEn,
    String type,
    LayersDto layers,
    RelationsDto relations,
    List<String> circulationPaths,
    String funFact
) {
    public record LayersDto(
        String anatomy,
        String physiology,
        String clinical
    ) {}

    public record RelationsDto(
        List<String> connectsTo,
        List<String> supplies,
        List<String> receivesFrom,
        List<String> affectedBy
    ) {}
}
