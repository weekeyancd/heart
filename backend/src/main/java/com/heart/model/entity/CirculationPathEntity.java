package com.heart.model.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "circulation_path")
public class CirculationPathEntity {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "name_zh", nullable = false)
    private String nameZh;

    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @Column(name = "animation_speed", nullable = false)
    private double animationSpeed;

    @OneToMany(mappedBy = "path", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CirculationNodeEntity> nodes = new HashSet<>();

    @OneToMany(mappedBy = "path", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CirculationEdgeEntity> edges = new HashSet<>();

    protected CirculationPathEntity() {}

    public CirculationPathEntity(String id, String nameZh, String nameEn, double animationSpeed) {
        this.id = id;
        this.nameZh = nameZh;
        this.nameEn = nameEn;
        this.animationSpeed = animationSpeed;
    }

    public String getId() { return id; }
    public String getNameZh() { return nameZh; }
    public String getNameEn() { return nameEn; }
    public double getAnimationSpeed() { return animationSpeed; }
    public Set<CirculationNodeEntity> getNodes() { return nodes; }
    public Set<CirculationEdgeEntity> getEdges() { return edges; }
}
