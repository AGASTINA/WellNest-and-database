package com.wellnest.service;

import com.wellnest.dto.TrainerChatMessageDto;
import com.wellnest.dto.TrainerChatThreadDto;
import com.wellnest.entity.TrainerChatMessage;
import com.wellnest.entity.User;
import com.wellnest.repository.TrainerChatMessageRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TrainerChatService {

    private final TrainerChatMessageRepository trainerChatMessageRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TrainerChatMessageDto> getConversation(Long userId, Integer trainerId) {
        return trainerChatMessageRepository.findByUserIdAndTrainerIdOrderByCreatedAtAsc(userId, trainerId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TrainerChatThreadDto> getTrainerThreads(Integer trainerId) {
        return trainerChatMessageRepository.findLatestMessagesByTrainerId(trainerId)
                .stream()
                .map(this::mapToThreadDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TrainerChatMessageDto> getConversationForTrainer(Integer trainerId, Long userId) {
        return trainerChatMessageRepository.findByUserIdAndTrainerIdOrderByCreatedAtAsc(userId, trainerId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional
    public TrainerChatMessageDto sendUserMessage(Long userId, Integer trainerId, String trainerName, String messageText) {
        Long safeUserId = Objects.requireNonNull(userId, "User id is required");
        if (messageText == null || messageText.trim().isEmpty()) {
            throw new RuntimeException("Message cannot be empty");
        }

        User user = userRepository.findById(safeUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TrainerChatMessage userMessage = new TrainerChatMessage();
        userMessage.setUser(user);
        userMessage.setTrainerId(trainerId);
        userMessage.setTrainerName((trainerName == null || trainerName.isBlank()) ? "Trainer" : trainerName.trim());
        userMessage.setSender("USER");
        userMessage.setMessage(messageText.trim());
        TrainerChatMessage savedUserMessage = trainerChatMessageRepository.save(userMessage);

        TrainerChatMessage autoReply = new TrainerChatMessage();
        autoReply.setUser(user);
        autoReply.setTrainerId(trainerId);
        autoReply.setTrainerName(savedUserMessage.getTrainerName());
        autoReply.setSender("TRAINER");
        autoReply.setMessage(generateTrainerAutoReply(savedUserMessage.getTrainerName(), messageText));
        trainerChatMessageRepository.save(autoReply);

        return mapToDto(savedUserMessage);
    }

    @Transactional
    public TrainerChatMessageDto sendTrainerReply(Long userId, Integer trainerId, String trainerName, String messageText) {
        Long safeUserId = Objects.requireNonNull(userId, "User id is required");
        if (messageText == null || messageText.trim().isEmpty()) {
            throw new RuntimeException("Message cannot be empty");
        }

        User user = userRepository.findById(safeUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TrainerChatMessage trainerMessage = new TrainerChatMessage();
        trainerMessage.setUser(user);
        trainerMessage.setTrainerId(trainerId);
        trainerMessage.setTrainerName((trainerName == null || trainerName.isBlank()) ? "Trainer" : trainerName.trim());
        trainerMessage.setSender("TRAINER");
        trainerMessage.setMessage(messageText.trim());

        return mapToDto(trainerChatMessageRepository.save(trainerMessage));
    }

    private String generateTrainerAutoReply(String trainerName, String messageText) {
        String text = messageText == null ? "" : messageText.toLowerCase();

        if (text.contains("time") || text.contains("slot") || text.contains("schedule")) {
            return "Great question! I usually open slots between 6:00-9:00 AM and 6:00-9:00 PM. Which time works best for you?";
        }
        if (text.contains("diet") || text.contains("food") || text.contains("nutrition")) {
            return "Absolutely. I can share a practical diet plan based on your current goal and routine after our first session.";
        }
        if (text.contains("price") || text.contains("fee") || text.contains("cost")) {
            return "Happy to help. We can discuss session fees and package options based on your goal in detail.";
        }

        return "Thanks for reaching out! I’m " + trainerName + ". Share your goal and current fitness level, and I’ll guide you from there.";
    }

    private TrainerChatMessageDto mapToDto(TrainerChatMessage message) {
        return new TrainerChatMessageDto(
                message.getId(),
                message.getTrainerId(),
                message.getTrainerName(),
                message.getSender(),
                message.getMessage(),
                message.getCreatedAt()
        );
    }

    private TrainerChatThreadDto mapToThreadDto(TrainerChatMessage message) {
        return new TrainerChatThreadDto(
                message.getUser().getId(),
                message.getUser().getName(),
                message.getUser().getEmail(),
                message.getTrainerId(),
                message.getTrainerName(),
                message.getSender(),
                message.getMessage(),
                message.getCreatedAt()
        );
    }
}
