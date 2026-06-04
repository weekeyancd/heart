package com.heart.model.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "heart_part")
public class HeartPartEntity {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "name_zh", nullable = false)
    private String nameZh;

    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String anatomy;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String physiology;

    @Column(columnDefinition = "TEXT")
    private String clinical;

    @ElementCollection
    @CollectionTable(name = "heart_part_connects_to", joinColumns = @JoinColumn(name = "heart_part_id"))
    @Column(name = "connects_to")
    private List<String> connectsTo = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "heart_part_supplies", joinColumns = @JoinColumn(name = "heart_part_id"))
    @Column(name = "supplies")
    private List<String> supplies = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "heart_part_receives_from", joinColumns = @JoinColumn(name = "heart_part_id"))
    @Column(name = "receives_from")
    private List<String> receivesFrom = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "heart_part_affected_by", joinColumns = @JoinColumn(name = "heart_part_id"))
    @Column(name = "affected_by")
    private List<String> affectedBy = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "heart_part_circulation_paths", joinColumns = @JoinColumn(name = "heart_part_id"))
    @Column(name = "circulation_path_id")
    private List<String> circulationPaths = new ArrayList<>();

    @Column(name = "fun_fact", columnDefinition = "TEXT")
    private String funFact;

    protected HeartPartEntity() {}

    public HeartPartEntity(String id, String nameZh, String nameEn, String type,
                           String anatomy, String physiology, String clinical,
                           List<String> connectsTo, List<String> supplies,
                           List<String> receivesFrom, List<String> affectedBy,
                           List<String> circulationPaths, String funFact) {
        this.id = id;
        this.nameZh = nameZh;
        this.nameEn = nameEn;
        this.type = type;
        this.anatomy = anatomy;
        this.physiology = physiology;
        this.clinical = clinical;
        this.connectsTo = connectsTo;
        this.supplies = supplies;
        this.receivesFrom = receivesFrom;
        this.affectedBy = affectedBy;
        this.circulationPaths = circulationPaths;
        this.funFact = funFact;
    }

    public String getId() { return id; }
    public String getNameZh() { return nameZh; }
    public String getNameEn() { return nameEn; }
    public String getType() { return type; }
    public String getAnatomy() { return anatomy; }
    public String getPhysiology() { return physiology; }
    public String getClinical() { return clinical; }
    public List<String> getConnectsTo() { return connectsTo; }
    public List<String> getSupplies() { return supplies; }
    public List<String> getReceivesFrom() { return receivesFrom; }
    public List<String> getAffectedBy() { return affectedBy; }
    public List<String> getCirculationPaths() { return circulationPaths; }
    public String getFunFact() { return funFact; }
}
