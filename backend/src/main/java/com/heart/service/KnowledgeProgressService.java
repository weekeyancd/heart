package com.heart.service;

import com.heart.model.dto.KnowledgeProgressDto;
import com.heart.model.entity.UserProgressEntity;
import com.heart.model.entity.VisitedPartEntity;
import com.heart.repository.HeartPartRepository;
import com.heart.repository.UserProgressRepository;
import com.heart.repository.VisitedPartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class KnowledgeProgressService {

    private final VisitedPartRepository visitedPartRepository;
    private final UserProgressRepository userProgressRepository;
    private final HeartPartRepository heartPartRepository;

    public KnowledgeProgressService(VisitedPartRepository visitedPartRepository,
                                    UserProgressRepository userProgressRepository,
                                    HeartPartRepository heartPartRepository) {
        this.visitedPartRepository = visitedPartRepository;
        this.userProgressRepository = userProgressRepository;
        this.heartPartRepository = heartPartRepository;
    }

    @Transactional(readOnly = true)
    public KnowledgeProgressDto getProgress(String userId) {
        List<String> visitedParts = visitedPartRepository.findByUserId(userId)
            .stream().map(VisitedPartEntity::getPartId).toList();

        int guidedSteps = userProgressRepository.findByUserId(userId)
            .map(UserProgressEntity::getGuidedStepsCompleted).orElse(0);

        int totalParts = (int) heartPartRepository.count();
        double pct = totalParts > 0 ? (visitedParts.size() * 100.0 / totalParts) : 0;

        return new KnowledgeProgressDto(userId, visitedParts, guidedSteps, totalParts, pct);
    }

    @Transactional
    public void markVisited(String userId, String partId) {
        if (!visitedPartRepository.existsByUserIdAndPartId(userId, partId)) {
            visitedPartRepository.save(new VisitedPartEntity(userId, partId));
        }
    }

    @Transactional
    public void updateGuidedSteps(String userId, int stepsCompleted) {
        UserProgressEntity progress = userProgressRepository.findByUserId(userId)
            .orElseGet(() -> new UserProgressEntity(userId));
        progress.setGuidedStepsCompleted(stepsCompleted);
        userProgressRepository.save(progress);
    }

    @Transactional
    public void resetProgress(String userId) {
        visitedPartRepository.deleteByUserId(userId);
        userProgressRepository.findByUserId(userId)
            .ifPresent(userProgressRepository::delete);
    }
}
