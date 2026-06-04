package com.heart.service;

import com.heart.model.dto.KnowledgeProgressDto;
import com.heart.model.entity.UserProgressEntity;
import com.heart.model.entity.VisitedPartEntity;
import com.heart.repository.HeartPartRepository;
import com.heart.repository.UserProgressRepository;
import com.heart.repository.VisitedPartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class KnowledgeProgressServiceTest {

    @Mock
    private VisitedPartRepository visitedPartRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @Mock
    private HeartPartRepository heartPartRepository;

    private KnowledgeProgressService service;

    @BeforeEach
    void setUp() {
        service = new KnowledgeProgressService(visitedPartRepository, userProgressRepository, heartPartRepository);
    }

    @Test
    @DisplayName("getProgress returns empty progress for new user")
    void getProgress_newUser_returnsEmptyProgress() {
        when(visitedPartRepository.findByUserId("user1")).thenReturn(List.of());
        when(userProgressRepository.findByUserId("user1")).thenReturn(Optional.empty());
        when(heartPartRepository.count()).thenReturn(14L);

        KnowledgeProgressDto result = service.getProgress("user1");

        assertThat(result.userId()).isEqualTo("user1");
        assertThat(result.visitedParts()).isEmpty();
        assertThat(result.guidedStepsCompleted()).isZero();
        assertThat(result.totalParts()).isEqualTo(14);
        assertThat(result.completionPercentage()).isZero();
    }

    @Test
    @DisplayName("getProgress returns visited parts and steps")
    void getProgress_existingUser_returnsProgress() {
        when(visitedPartRepository.findByUserId("user1")).thenReturn(
            List.of(new VisitedPartEntity("user1", "left-atrium"))
        );
        UserProgressEntity progress = new UserProgressEntity("user1");
        progress.setGuidedStepsCompleted(3);
        when(userProgressRepository.findByUserId("user1")).thenReturn(Optional.of(progress));
        when(heartPartRepository.count()).thenReturn(14L);

        KnowledgeProgressDto result = service.getProgress("user1");

        assertThat(result.visitedParts()).containsExactly("left-atrium");
        assertThat(result.guidedStepsCompleted()).isEqualTo(3);
        assertThat(result.completionPercentage()).isCloseTo(7.14, org.assertj.core.data.Offset.offset(0.01));
    }

    @Test
    @DisplayName("markVisited saves new visit when not already visited")
    void markVisited_newVisit_savesEntity() {
        when(visitedPartRepository.existsByUserIdAndPartId("user1", "left-atrium")).thenReturn(false);

        service.markVisited("user1", "left-atrium");

        verify(visitedPartRepository).save(any(VisitedPartEntity.class));
    }

    @Test
    @DisplayName("markVisited skips when already visited")
    void markVisited_duplicateVisit_doesNotSave() {
        when(visitedPartRepository.existsByUserIdAndPartId("user1", "left-atrium")).thenReturn(true);

        service.markVisited("user1", "left-atrium");

        verify(visitedPartRepository, org.mockito.Mockito.never()).save(any());
    }

    @Test
    @DisplayName("updateGuidedSteps creates new progress if not exists")
    void updateGuidedSteps_newUser_createsProgress() {
        when(userProgressRepository.findByUserId("user1")).thenReturn(Optional.empty());

        service.updateGuidedSteps("user1", 5);

        verify(userProgressRepository).save(any(UserProgressEntity.class));
    }

    @Test
    @DisplayName("updateGuidedSteps updates existing progress")
    void updateGuidedSteps_existingUser_updatesProgress() {
        UserProgressEntity progress = new UserProgressEntity("user1");
        when(userProgressRepository.findByUserId("user1")).thenReturn(Optional.of(progress));

        service.updateGuidedSteps("user1", 7);

        assertThat(progress.getGuidedStepsCompleted()).isEqualTo(7);
        verify(userProgressRepository).save(progress);
    }

    @Test
    @DisplayName("resetProgress deletes visits and progress")
    void resetProgress_deletesAllUserData() {
        when(userProgressRepository.findByUserId("user1")).thenReturn(Optional.of(new UserProgressEntity("user1")));

        service.resetProgress("user1");

        verify(visitedPartRepository).deleteByUserId("user1");
        verify(userProgressRepository).delete(any(UserProgressEntity.class));
    }
}
