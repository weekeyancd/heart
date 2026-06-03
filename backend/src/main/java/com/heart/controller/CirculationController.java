package com.heart.controller;

import com.heart.model.dto.ApiResponse;
import com.heart.model.dto.CirculationPathDto;
import com.heart.service.CirculationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/circulation")
public class CirculationController {

    private final CirculationService circulationService;

    public CirculationController(CirculationService circulationService) {
        this.circulationService = circulationService;
    }

    @GetMapping
    public ApiResponse<java.util.List<CirculationPathDto>> findAll() {
        return ApiResponse.ok(circulationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CirculationPathDto>> findById(@PathVariable String id) {
        return circulationService.findById(id)
            .map(path -> ResponseEntity.ok(ApiResponse.ok(path)))
            .orElseGet(() -> ResponseEntity.status(404)
                .body(ApiResponse.error("Circulation path not found: " + id)));
    }
}
