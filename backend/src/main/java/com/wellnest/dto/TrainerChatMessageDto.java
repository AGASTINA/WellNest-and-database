package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerChatMessageDto {
    private Long id;
    private Integer trainerId;
    private String trainerName;
    private String sender;
    private String message;
    private LocalDateTime createdAt;
}
