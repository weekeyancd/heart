package com.heart.repository;

import com.heart.model.entity.VisitedPartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitedPartRepository extends JpaRepository<VisitedPartEntity, Long> {
    List<VisitedPartEntity> findByUserId(String userId);
    boolean existsByUserIdAndPartId(String userId, String partId);
    void deleteByUserId(String userId);
}
