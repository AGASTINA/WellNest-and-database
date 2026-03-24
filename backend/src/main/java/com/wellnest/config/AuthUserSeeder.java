package com.wellnest.config;

import com.wellnest.entity.User;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class AuthUserSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AuthUserSeeder.class);
    private static final String DEMO_PASSWORD = "password123";

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        upsertLocalUser("user@example.com", "Test User", "USER");
        upsertLocalUser("admin@wellnest.com", "Admin User", "ADMIN");
    }

    private void upsertLocalUser(String email, String name, String role) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);

        user.setEmail(email);
        user.setName(name);
        user.setRole(role);
        user.setAuthProvider("LOCAL");
        user.setPassword(passwordEncoder.encode(DEMO_PASSWORD));

        userRepository.save(user);
        log.info("Auth seeder ensured local user: {} ({})", email, role);
    }
}
