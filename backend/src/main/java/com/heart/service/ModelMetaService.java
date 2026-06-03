package com.heart.service;

import com.heart.model.dto.ModelMetaDto;
import com.heart.model.dto.ModelMetaDto.ColorMappingDto;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ModelMetaService {

    private ModelMetaDto meta;

    @PostConstruct
    void init() {
        List<String> partIds = List.of(
            "left-atrium", "left-ventricle", "right-atrium", "right-ventricle",
            "aorta", "pulmonary-artery", "superior-vena-cava", "inferior-vena-cava", "pulmonary-vein",
            "tricuspid-valve", "mitral-valve", "pulmonary-valve", "aortic-valve",
            "septum"
        );

        Map<String, ColorMappingDto> colorMapping = Map.ofEntries(
            Map.entry("left-atrium", new ColorMappingDto("#e74c3c", "#ff4444", "#6622aa")),
            Map.entry("left-ventricle", new ColorMappingDto("#c0392b", "#ff3333", "#5522aa")),
            Map.entry("right-atrium", new ColorMappingDto("#8e44ad", "#cc44aa", "#4422cc")),
            Map.entry("right-ventricle", new ColorMappingDto("#7d3c98", "#bb44aa", "#3311aa")),
            Map.entry("aorta", new ColorMappingDto("#e74c3c", "#ff4444", "#6622aa")),
            Map.entry("pulmonary-artery", new ColorMappingDto("#8e44ad", "#cc44aa", "#4422cc")),
            Map.entry("superior-vena-cava", new ColorMappingDto("#8e44ad", "#cc44aa", "#4422cc")),
            Map.entry("inferior-vena-cava", new ColorMappingDto("#8e44ad", "#cc44aa", "#4422cc")),
            Map.entry("pulmonary-vein", new ColorMappingDto("#e74c3c", "#ff4444", "#6622aa")),
            Map.entry("tricuspid-valve", new ColorMappingDto("#f39c12", "#f39c12", "#f39c12")),
            Map.entry("mitral-valve", new ColorMappingDto("#f39c12", "#f39c12", "#f39c12")),
            Map.entry("pulmonary-valve", new ColorMappingDto("#f39c12", "#f39c12", "#f39c12")),
            Map.entry("aortic-valve", new ColorMappingDto("#f39c12", "#f39c12", "#f39c12")),
            Map.entry("septum", new ColorMappingDto("#bdc3c7", "#bdc3c7", "#bdc3c7"))
        );

        Map<String, List<String>> occlusionMap = Map.of(
            "left-ventricle", List.of("septum", "left-atrium"),
            "right-ventricle", List.of("septum", "right-atrium"),
            "left-atrium", List.of("aorta", "pulmonary-vein"),
            "right-atrium", List.of("superior-vena-cava", "inferior-vena-cava"),
            "tricuspid-valve", List.of("right-atrium", "right-ventricle"),
            "mitral-valve", List.of("left-atrium", "left-ventricle"),
            "pulmonary-valve", List.of("pulmonary-artery", "right-ventricle"),
            "aortic-valve", List.of("aorta", "left-ventricle")
        );

        meta = new ModelMetaDto(partIds, colorMapping, occlusionMap);
    }

    public ModelMetaDto getModelMeta() {
        return meta;
    }
}
