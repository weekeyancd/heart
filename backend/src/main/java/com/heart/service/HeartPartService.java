package com.heart.service;

import com.heart.model.dto.HeartPartDto;
import com.heart.model.entity.HeartPartEntity;
import com.heart.repository.HeartPartRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HeartPartService {

    private final HeartPartRepository repository;

    public HeartPartService(HeartPartRepository repository) {
        this.repository = repository;
    }

    public List<HeartPartDto> findAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public Optional<HeartPartDto> findById(String id) {
        return repository.findById(id).map(this::toDto);
    }

    private HeartPartDto toDto(HeartPartEntity e) {
        return new HeartPartDto(
            e.getId(),
            e.getNameZh(),
            e.getNameEn(),
            e.getType(),
            new HeartPartDto.LayersDto(e.getAnatomy(), e.getPhysiology(), e.getClinical()),
            new HeartPartDto.RelationsDto(e.getConnectsTo(), e.getSupplies(), e.getReceivesFrom(), e.getAffectedBy()),
            e.getCirculationPaths(),
            e.getFunFact()
        );
    }
}
