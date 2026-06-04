package com.heart.service;

import com.heart.model.dto.CirculationPathDto;
import com.heart.model.dto.CirculationPathDto.EdgeDto;
import com.heart.model.dto.CirculationPathDto.NodeDto;
import com.heart.model.entity.CirculationEdgeEntity;
import com.heart.model.entity.CirculationNodeEntity;
import com.heart.model.entity.CirculationPathEntity;
import com.heart.repository.CirculationPathRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CirculationService {

    private final CirculationPathRepository repository;

    public CirculationService(CirculationPathRepository repository) {
        this.repository = repository;
    }

    public List<CirculationPathDto> findAll() {
        return repository.findAllWithNodesAndEdges().stream().map(this::toDto).toList();
    }

    public Optional<CirculationPathDto> findById(String id) {
        return repository.findByIdWithNodesAndEdges(id).map(this::toDto);
    }

    private CirculationPathDto toDto(CirculationPathEntity e) {
        List<NodeDto> nodes = e.getNodes().stream().map(this::toNodeDto).collect(Collectors.toList());
        List<EdgeDto> edges = e.getEdges().stream().map(this::toEdgeDto).collect(Collectors.toList());
        return new CirculationPathDto(e.getId(), e.getNameZh(), e.getNameEn(), nodes, edges, e.getAnimationSpeed());
    }

    private NodeDto toNodeDto(CirculationNodeEntity e) {
        return new NodeDto(e.getPartId(), new double[]{e.getPosX(), e.getPosY(), e.getPosZ()});
    }

    private EdgeDto toEdgeDto(CirculationEdgeEntity e) {
        return new EdgeDto(e.getFromPartId(), e.getToPartId(), e.getDirection(), e.getDuration(), e.getDelay(), e.getOxygenLevel());
    }
}
