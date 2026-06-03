package com.heart.model.dto;

import java.util.List;

public record CirculationPathDto(
    String id,
    String nameZh,
    String nameEn,
    List<NodeDto> nodes,
    List<EdgeDto> edges,
    double animationSpeed
) {
    public record NodeDto(
        String partId,
        double[] position
    ) {}

    public record EdgeDto(
        String from,
        String to,
        String direction,
        double duration,
        double delay,
        double oxygenLevel
    ) {}
}
