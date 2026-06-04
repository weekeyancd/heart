package com.heart.repository;

import com.heart.model.entity.CirculationPathEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CirculationPathRepository extends JpaRepository<CirculationPathEntity, String> {

    @Query("SELECT p FROM CirculationPathEntity p LEFT JOIN FETCH p.nodes LEFT JOIN FETCH p.edges")
    List<CirculationPathEntity> findAllWithNodesAndEdges();

    @Query("SELECT p FROM CirculationPathEntity p LEFT JOIN FETCH p.nodes LEFT JOIN FETCH p.edges WHERE p.id = :id")
    Optional<CirculationPathEntity> findByIdWithNodesAndEdges(String id);
}
