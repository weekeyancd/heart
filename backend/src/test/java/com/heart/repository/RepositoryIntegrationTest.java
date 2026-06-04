package com.heart.repository;

import com.heart.model.entity.CirculationEdgeEntity;
import com.heart.model.entity.CirculationNodeEntity;
import com.heart.model.entity.CirculationPathEntity;
import com.heart.model.entity.HeartPartEntity;
import com.heart.model.entity.UserProgressEntity;
import com.heart.model.entity.VisitedPartEntity;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class RepositoryIntegrationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private HeartPartRepository heartPartRepository;

    @Autowired
    private CirculationPathRepository circulationPathRepository;

    @Autowired
    private VisitedPartRepository visitedPartRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Nested
    @DisplayName("HeartPartRepository")
    class HeartPartTests {

        @Test
        @DisplayName("seed data loads 14 heart parts")
        void seedData_loadsHeartParts() {
            assertThat(heartPartRepository.count()).isEqualTo(14);
        }

        @Test
        @DisplayName("findAllByType returns parts matching type")
        void findAllByType_returnsMatchingParts() {
            List<HeartPartEntity> chambers = heartPartRepository.findAllByType("chamber");
            List<HeartPartEntity> vessels = heartPartRepository.findAllByType("vessel");
            List<HeartPartEntity> valves = heartPartRepository.findAllByType("valve");

            assertThat(chambers).hasSize(4);
            assertThat(vessels).hasSize(5);
            assertThat(valves).hasSize(4);
        }

        @Test
        @DisplayName("findById returns part with element collections")
        void findById_returnsPartWithCollections() {
            Optional<HeartPartEntity> part = heartPartRepository.findById("left-ventricle");

            assertThat(part).isPresent();
            assertThat(part.get().getNameZh()).isEqualTo("左心室");
            assertThat(part.get().getConnectsTo()).isNotEmpty();
            assertThat(part.get().getCirculationPaths()).isNotEmpty();
        }

        @Test
        @DisplayName("findById returns empty for unknown id")
        void findById_unknownId_returnsEmpty() {
            assertThat(heartPartRepository.findById("nonexistent")).isEmpty();
        }
    }

    @Nested
    @DisplayName("CirculationPathRepository")
    class CirculationPathTests {

        @Test
        @DisplayName("findAllWithNodesAndEdges returns paths with fetched relations")
        void findAllWithNodesAndEdges_returnsPaths() {
            List<CirculationPathEntity> paths = circulationPathRepository.findAllWithNodesAndEdges();

            assertThat(paths).isNotEmpty();
            for (CirculationPathEntity path : paths) {
                assertThat(path.getNodes()).isNotNull();
                assertThat(path.getEdges()).isNotNull();
            }
        }

        @Test
        @DisplayName("findByIdWithNodesAndEdges returns path with relations")
        void findByIdWithNodesAndEdges_returnsPath() {
            List<CirculationPathEntity> all = circulationPathRepository.findAllWithNodesAndEdges();
            assertThat(all).isNotEmpty();

            String firstId = all.get(0).getId();
            Optional<CirculationPathEntity> found = circulationPathRepository.findByIdWithNodesAndEdges(firstId);

            assertThat(found).isPresent();
            assertThat(found.get().getNodes()).isNotEmpty();
            assertThat(found.get().getEdges()).isNotEmpty();
        }

        @Test
        @DisplayName("findByIdWithNodesAndEdges returns empty for unknown id")
        void findByIdWithNodesAndEdges_unknownId_returnsEmpty() {
            assertThat(circulationPathRepository.findByIdWithNodesAndEdges("nonexistent")).isEmpty();
        }

        @Test
        @DisplayName("cascade persists nodes and edges with path")
        void cascadePersists_nodesAndEdges() {
            CirculationPathEntity path = new CirculationPathEntity("test-path", "测试路径", "Test Path", 1.0);
            path.getNodes().add(new CirculationNodeEntity(path, "left-atrium", 1, 2, 3));
            path.getEdges().add(new CirculationEdgeEntity(path, "left-atrium", "left-ventricle", "forward", 1.0, 0.0, 1.0));

            circulationPathRepository.save(path);
            entityManager.flush();
            entityManager.clear();

            Optional<CirculationPathEntity> loaded = circulationPathRepository.findByIdWithNodesAndEdges("test-path");
            assertThat(loaded).isPresent();
            assertThat(loaded.get().getNodes()).hasSize(1);
            assertThat(loaded.get().getEdges()).hasSize(1);
        }
    }

    @Nested
    @DisplayName("VisitedPartRepository")
    class VisitedPartTests {

        @Test
        @DisplayName("save and findByUserId returns visits")
        void save_and_findByUserId() {
            visitedPartRepository.save(new VisitedPartEntity("user1", "left-atrium"));
            visitedPartRepository.save(new VisitedPartEntity("user1", "left-ventricle"));
            visitedPartRepository.save(new VisitedPartEntity("user2", "right-atrium"));

            List<VisitedPartEntity> user1Visits = visitedPartRepository.findByUserId("user1");
            assertThat(user1Visits).hasSize(2);
            assertThat(user1Visits.stream().map(VisitedPartEntity::getPartId).toList())
                .containsExactlyInAnyOrder("left-atrium", "left-ventricle");
        }

        @Test
        @DisplayName("existsByUserIdAndPartId detects duplicates")
        void existsByUserIdAndPartId_detectsDuplicates() {
            visitedPartRepository.save(new VisitedPartEntity("user1", "aorta"));

            assertThat(visitedPartRepository.existsByUserIdAndPartId("user1", "aorta")).isTrue();
            assertThat(visitedPartRepository.existsByUserIdAndPartId("user1", "pulmonary-artery")).isFalse();
            assertThat(visitedPartRepository.existsByUserIdAndPartId("user2", "aorta")).isFalse();
        }

        @Test
        @DisplayName("deleteByUserId removes all visits for user")
        void deleteByUserId_removesAllVisits() {
            visitedPartRepository.save(new VisitedPartEntity("user1", "left-atrium"));
            visitedPartRepository.save(new VisitedPartEntity("user1", "aorta"));
            visitedPartRepository.save(new VisitedPartEntity("user2", "right-atrium"));

            visitedPartRepository.deleteByUserId("user1");
            entityManager.flush();

            assertThat(visitedPartRepository.findByUserId("user1")).isEmpty();
            assertThat(visitedPartRepository.findByUserId("user2")).hasSize(1);
        }
    }

    @Nested
    @DisplayName("UserProgressRepository")
    class UserProgressTests {

        @Test
        @DisplayName("save and findByUserId returns progress")
        void save_and_findByUserId() {
            UserProgressEntity progress = new UserProgressEntity("user1");
            progress.setGuidedStepsCompleted(5);
            userProgressRepository.save(progress);

            Optional<UserProgressEntity> found = userProgressRepository.findByUserId("user1");

            assertThat(found).isPresent();
            assertThat(found.get().getGuidedStepsCompleted()).isEqualTo(5);
        }

        @Test
        @DisplayName("findByUserId returns empty for unknown user")
        void findByUserId_unknownUser_returnsEmpty() {
            assertThat(userProgressRepository.findByUserId("nonexistent")).isEmpty();
        }

        @Test
        @DisplayName("update guided steps preserves userId")
        void updateGuidedSteps_preservesUserId() {
            UserProgressEntity progress = new UserProgressEntity("user1");
            progress.setGuidedStepsCompleted(3);
            userProgressRepository.save(progress);

            progress.setGuidedStepsCompleted(7);
            userProgressRepository.save(progress);

            Optional<UserProgressEntity> found = userProgressRepository.findByUserId("user1");
            assertThat(found).isPresent();
            assertThat(found.get().getGuidedStepsCompleted()).isEqualTo(7);
        }

        @Test
        @DisplayName("delete removes progress")
        void delete_removesProgress() {
            UserProgressEntity progress = new UserProgressEntity("user1");
            userProgressRepository.save(progress);

            userProgressRepository.delete(progress);
            entityManager.flush();

            assertThat(userProgressRepository.findByUserId("user1")).isEmpty();
        }
    }
}
