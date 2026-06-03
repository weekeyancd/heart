package com.heart.service;

import com.heart.model.dto.CirculationPathDto;
import com.heart.model.dto.CirculationPathDto.EdgeDto;
import com.heart.model.dto.CirculationPathDto.NodeDto;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CirculationService {

    private Map<String, CirculationPathDto> paths;

    @PostConstruct
    void init() {
        paths = Map.of(
            "systemic-loop", new CirculationPathDto(
                "systemic-loop", "体循环", "Systemic Circulation",
                List.of(
                    new NodeDto("left-ventricle", new double[]{0, 0.5, 0.3}),
                    new NodeDto("aorta", new double[]{0.3, 1.2, 0.2}),
                    new NodeDto("superior-vena-cava", new double[]{-0.4, 1.3, -0.1}),
                    new NodeDto("inferior-vena-cava", new double[]{-0.3, -0.8, -0.1}),
                    new NodeDto("right-atrium", new double[]{-0.3, 0.6, 0.2})
                ),
                List.of(
                    new EdgeDto("left-ventricle", "aorta", "oxy", 2.0, 0, 1.0),
                    new EdgeDto("aorta", "superior-vena-cava", "deoxy", 4.0, 2.0, 0.6),
                    new EdgeDto("aorta", "inferior-vena-cava", "deoxy", 4.0, 2.0, 0.4),
                    new EdgeDto("superior-vena-cava", "right-atrium", "deoxy", 1.5, 6.0, 0.2),
                    new EdgeDto("inferior-vena-cava", "right-atrium", "deoxy", 1.5, 6.0, 0.2)
                ),
                1.0
            ),
            "pulmonary-loop", new CirculationPathDto(
                "pulmonary-loop", "肺循环", "Pulmonary Circulation",
                List.of(
                    new NodeDto("right-ventricle", new double[]{0, -0.2, 0.3}),
                    new NodeDto("pulmonary-artery", new double[]{0.2, 1.0, -0.2}),
                    new NodeDto("pulmonary-vein", new double[]{-0.2, 1.0, 0.3}),
                    new NodeDto("left-atrium", new double[]{0.2, 0.7, 0.3})
                ),
                List.of(
                    new EdgeDto("right-ventricle", "pulmonary-artery", "deoxy", 2.0, 0, 0.2),
                    new EdgeDto("pulmonary-artery", "pulmonary-vein", "oxy", 4.0, 2.0, 0.6),
                    new EdgeDto("pulmonary-vein", "left-atrium", "oxy", 1.5, 6.0, 1.0)
                ),
                1.0
            )
        );
    }

    public List<CirculationPathDto> findAll() {
        return List.copyOf(paths.values());
    }

    public Optional<CirculationPathDto> findById(String id) {
        return Optional.ofNullable(paths.get(id));
    }
}
