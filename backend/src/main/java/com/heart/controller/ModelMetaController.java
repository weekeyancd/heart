package com.heart.controller;

import com.heart.model.dto.ApiResponse;
import com.heart.model.dto.ModelMetaDto;
import com.heart.service.ModelMetaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/models")
public class ModelMetaController {

    private final ModelMetaService modelMetaService;

    public ModelMetaController(ModelMetaService modelMetaService) {
        this.modelMetaService = modelMetaService;
    }

    @GetMapping("/meta")
    public ApiResponse<ModelMetaDto> getModelMeta() {
        return ApiResponse.ok(modelMetaService.getModelMeta());
    }
}
