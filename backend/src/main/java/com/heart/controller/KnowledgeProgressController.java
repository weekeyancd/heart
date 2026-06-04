package com.heart.controller;

import com.heart.model.dto.ApiResponse;
import com.heart.model.dto.GuidedStepsRequest;
import com.heart.model.dto.KnowledgeProgressDto;
import com.heart.model.dto.VisitRequest;
import com.heart.service.KnowledgeProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
public class KnowledgeProgressController {

    private final KnowledgeProgressService progressService;

    public KnowledgeProgressController(KnowledgeProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/{userId}")
    public ApiResponse<KnowledgeProgressDto> getProgress(@PathVariable String userId) {
        return ApiResponse.ok(progressService.getProgress(userId));
    }

    @PostMapping("/{userId}/visit")
    public ApiResponse<Void> markVisited(@PathVariable String userId,
                                         @RequestBody VisitRequest request) {
        progressService.markVisited(userId, request.partId());
        return ApiResponse.ok(null);
    }

    @PutMapping("/{userId}/guided-steps")
    public ApiResponse<Void> updateGuidedSteps(@PathVariable String userId,
                                                @RequestBody GuidedStepsRequest request) {
        progressService.updateGuidedSteps(userId, request.stepsCompleted());
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Void>> resetProgress(@PathVariable String userId) {
        progressService.resetProgress(userId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
