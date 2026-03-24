package com.wellnest.dto;

import lombok.Data;

@Data
public class TrainerChatSendRequest {
    private String trainerName;
    private String message;
}
