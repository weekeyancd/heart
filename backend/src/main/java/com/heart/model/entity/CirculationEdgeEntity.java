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
@Table(name = "circulation_edge")
public class CirculationEdgeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "path_id", nullable = false)
    private CirculationPathEntity path;

    @Column(name = "from_part_id", nullable = false, length = 50)
    private String fromPartId;

    @Column(name = "to_part_id", nullable = false, length = 50)
    private String toPartId;

    @Column(nullable = false, length = 10)
    private String direction;

    @Column(nullable = false)
    private double duration;

    @Column(nullable = false)
    private double delay;

    @Column(name = "oxygen_level", nullable = false)
    private double oxygenLevel;

    protected CirculationEdgeEntity() {}

    public CirculationEdgeEntity(CirculationPathEntity path, String fromPartId, String toPartId,
                                 String direction, double duration, double delay, double oxygenLevel) {
        this.path = path;
        this.fromPartId = fromPartId;
        this.toPartId = toPartId;
        this.direction = direction;
        this.duration = duration;
        this.delay = delay;
        this.oxygenLevel = oxygenLevel;
    }

    public Long getId() { return id; }
    public CirculationPathEntity getPath() { return path; }
    public String getFromPartId() { return fromPartId; }
    public String getToPartId() { return toPartId; }
    public String getDirection() { return direction; }
    public double getDuration() { return duration; }
    public double getDelay() { return delay; }
    public double getOxygenLevel() { return oxygenLevel; }
}
