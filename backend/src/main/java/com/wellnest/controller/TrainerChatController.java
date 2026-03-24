package com.wellnest.controller;

import com.wellnest.dto.MessageResponse;
import com.wellnest.dto.TrainerChatMessageDto;
import com.wellnest.dto.TrainerChatSendRequest;
import com.wellnest.dto.TrainerChatThreadDto;
import com.wellnest.service.TrainerChatService;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainer-chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
@RequiredArgsConstructor
public class TrainerChatController {

    private final TrainerChatService trainerChatService;
    private final UserService userService;

    @GetMapping("/{trainerId}")
    public ResponseEntity<?> getConversation(@PathVariable Integer trainerId) {
        try {
            Long userId = extractUserIdFromSecurityContext();
            List<TrainerChatMessageDto> messages = trainerChatService.getConversation(userId, trainerId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{trainerId}/threads")
    public ResponseEntity<?> getTrainerThreads(@PathVariable Integer trainerId) {
        try {
            ensureAdmin();
            List<TrainerChatThreadDto> threads = trainerChatService.getTrainerThreads(trainerId);
            return ResponseEntity.ok(threads);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{trainerId}/user/{userId}")
    public ResponseEntity<?> getConversationForTrainer(@PathVariable Integer trainerId, @PathVariable Long userId) {
        try {
            ensureAdmin();
            List<TrainerChatMessageDto> messages = trainerChatService.getConversationForTrainer(trainerId, userId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/{trainerId}")
    public ResponseEntity<?> sendMessage(@PathVariable Integer trainerId, @RequestBody TrainerChatSendRequest request) {
        try {
            Long userId = extractUserIdFromSecurityContext();
            TrainerChatMessageDto message = trainerChatService.sendUserMessage(
                    userId,
                    trainerId,
                    request.getTrainerName(),
                    request.getMessage()
            );
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/{trainerId}/user/{userId}/reply")
    public ResponseEntity<?> sendTrainerReply(
            @PathVariable Integer trainerId,
            @PathVariable Long userId,
            @RequestBody TrainerChatSendRequest request) {
        try {
            ensureAdmin();
            TrainerChatMessageDto message = trainerChatService.sendTrainerReply(
                    userId,
                    trainerId,
                    request.getTrainerName(),
                    request.getMessage()
            );
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    private Long extractUserIdFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new RuntimeException("Session expired. Please log in again.");
        }

        String email = authentication.getName();
        return userService.getUserProfile(email).getId();
    }

    private void ensureAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new RuntimeException("Session expired. Please log in again.");
        }

        String email = authentication.getName();
        String role = userService.getUserProfile(email).getRole();
        if (role == null || !"ADMIN".equalsIgnoreCase(role.trim())) {
            throw new RuntimeException("You are not authorized to access trainer inbox.");
        }
    }
}
