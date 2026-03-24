package com.wellnest.repository;

import com.wellnest.entity.TrainerChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerChatMessageRepository extends JpaRepository<TrainerChatMessage, Long> {

    List<TrainerChatMessage> findByUserIdAndTrainerIdOrderByCreatedAtAsc(Long userId, Integer trainerId);

        @Query("""
                        SELECT m
                        FROM TrainerChatMessage m
                        WHERE m.trainerId = :trainerId
                            AND m.createdAt = (
                                        SELECT MAX(m2.createdAt)
                                        FROM TrainerChatMessage m2
                                        WHERE m2.trainerId = :trainerId
                                            AND m2.user.id = m.user.id
                            )
                        ORDER BY m.createdAt DESC
                        """)
        List<TrainerChatMessage> findLatestMessagesByTrainerId(@Param("trainerId") Integer trainerId);
}
