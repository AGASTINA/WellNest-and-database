package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerChatThreadDto {
    private Long userId;
    private String userName;
    private String userEmail;
    private Integer trainerId;
    private String trainerName;
    private String lastSender;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
}
