package com.heart.model.dto;

import java.util.List;

public record KnowledgeProgressDto(
    String userId,
    List<String> visitedParts,
    int guidedStepsCompleted,
    int totalParts,
    double completionPercentage
) {}
