package com.heart.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.Instant;

@Entity
@Table(name = "visited_part", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "part_id"}))
public class VisitedPartEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, length = 100)
    private String userId;

    @Column(name = "part_id", nullable = false, length = 50)
    private String partId;

    @Column(name = "visited_at", nullable = false)
    private Instant visitedAt;

    protected VisitedPartEntity() {}

    public VisitedPartEntity(String userId, String partId) {
        this.userId = userId;
        this.partId = partId;
        this.visitedAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public String getPartId() { return partId; }
    public Instant getVisitedAt() { return visitedAt; }
}
