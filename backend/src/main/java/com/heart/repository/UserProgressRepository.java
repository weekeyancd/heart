package com.heart.repository;

import com.heart.model.entity.UserProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProgressRepository extends JpaRepository<UserProgressEntity, String> {
    Optional<UserProgressEntity> findByUserId(String userId);
}
