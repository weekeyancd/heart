package com.heart.controller;

import com.heart.model.dto.ApiResponse;
import com.heart.model.dto.HeartPartDto;
import com.heart.service.HeartPartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/parts")
public class HeartPartController {

    private final HeartPartService heartPartService;

    public HeartPartController(HeartPartService heartPartService) {
        this.heartPartService = heartPartService;
    }

    @GetMapping
    public ApiResponse<java.util.List<HeartPartDto>> findAll() {
        return ApiResponse.ok(heartPartService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HeartPartDto>> findById(@PathVariable String id) {
        return heartPartService.findById(id)
            .map(part -> ResponseEntity.ok(ApiResponse.ok(part)))
            .orElseGet(() -> ResponseEntity.status(404)
                .body(ApiResponse.error("Part not found: " + id)));
    }
}
