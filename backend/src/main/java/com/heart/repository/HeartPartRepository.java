package com.heart.repository;

import com.heart.model.entity.HeartPartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HeartPartRepository extends JpaRepository<HeartPartEntity, String> {
    List<HeartPartEntity> findAllByType(String type);
}
