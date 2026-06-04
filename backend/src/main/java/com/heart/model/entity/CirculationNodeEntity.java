package com.heart.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "circulation_node")
public class CirculationNodeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "path_id", nullable = false)
    private CirculationPathEntity path;

    @Column(name = "part_id", nullable = false, length = 50)
    private String partId;

    @Column(name = "pos_x", nullable = false)
    private double posX;

    @Column(name = "pos_y", nullable = false)
    private double posY;

    @Column(name = "pos_z", nullable = false)
    private double posZ;

    protected CirculationNodeEntity() {}

    public CirculationNodeEntity(CirculationPathEntity path, String partId, double posX, double posY, double posZ) {
        this.path = path;
        this.partId = partId;
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
    }

    public Long getId() { return id; }
    public CirculationPathEntity getPath() { return path; }
    public String getPartId() { return partId; }
    public double getPosX() { return posX; }
    public double getPosY() { return posY; }
    public double getPosZ() { return posZ; }
}
