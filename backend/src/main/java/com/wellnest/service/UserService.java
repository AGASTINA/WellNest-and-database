package com.wellnest.service;

import com.wellnest.dto.UserDto;
import com.wellnest.entity.User;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToDto(user);
    }

    @Transactional
    public UserDto updateUserProfile(String email, UserDto userDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userDto.getFirstName() != null)
            user.setFirstName(userDto.getFirstName());
        if (userDto.getLastName() != null)
            user.setLastName(userDto.getLastName());
        if (userDto.getWeight() != null)
            user.setWeight(userDto.getWeight());
        if (userDto.getHeight() != null)
            user.setHeight(userDto.getHeight());
        if (userDto.getAge() != null)
            user.setAge(userDto.getAge());
        if (userDto.getFitnessGoal() != null)
            user.setFitnessGoal(userDto.getFitnessGoal());

        // Update name if first/last name changes
        if (userDto.getFirstName() != null || userDto.getLastName() != null) {
            String firstName = userDto.getFirstName() != null ? userDto.getFirstName()
                    : (user.getFirstName() != null ? user.getFirstName() : "");
            String lastName = userDto.getLastName() != null ? userDto.getLastName()
                    : (user.getLastName() != null ? user.getLastName() : "");

            String fullName = (firstName + " " + lastName).trim();
            if (!fullName.isEmpty()) {
                user.setName(fullName);
            }
        }

        if (userDto.getPhoneNumber() != null) {
            user.setPhoneNumber(userDto.getPhoneNumber());
        }

        if (userDto.getRole() != null && !userDto.getRole().isBlank()) {
            user.setRole(userDto.getRole().trim().toUpperCase());
        }

        @SuppressWarnings("null")
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Transactional
    @SuppressWarnings("null")
    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getPassword() == null) {
            throw new RuntimeException("This account uses social login. Please sign in with Google.");
        }

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setWeight(user.getWeight());
        dto.setHeight(user.getHeight());
        dto.setAge(user.getAge());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setFitnessGoal(user.getFitnessGoal());
        return dto;
    }
}
