package com.heart.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "user_progress")
public class UserProgressEntity {

    @Id
    @Column(length = 100)
    private String userId;

    @Column(name = "guided_steps_completed", nullable = false)
    private int guidedStepsCompleted = 0;

    @Column(name = "last_active_at", nullable = false)
    private Instant lastActiveAt;

    protected UserProgressEntity() {}

    public UserProgressEntity(String userId) {
        this.userId = userId;
        this.lastActiveAt = Instant.now();
    }

    public String getUserId() { return userId; }
    public int getGuidedStepsCompleted() { return guidedStepsCompleted; }
    public Instant getLastActiveAt() { return lastActiveAt; }

    public void setGuidedStepsCompleted(int steps) {
        this.guidedStepsCompleted = steps;
        this.lastActiveAt = Instant.now();
    }
}
