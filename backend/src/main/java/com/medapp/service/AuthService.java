package com.medapp.service;

import com.medapp.dto.LoginRequest;
import com.medapp.dto.LoginResponse;
import com.medapp.entity.User;
import com.medapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<LoginResponse> login(LoginRequest request) {
        return userRepository.findByEmailAndPassword(request.getEmail(), request.getPassword())
                .map(user -> {
                    String token = Base64.getEncoder().encodeToString(
                            (user.getId() + ":" + UUID.randomUUID()).getBytes());
                    return new LoginResponse(user, token);
                });
    }

    public Optional<User> validateToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return Optional.empty();
        }
        String rawToken = token.substring(7);
        try {
            String decoded = new String(Base64.getDecoder().decode(rawToken));
            Long userId = Long.parseLong(decoded.split(":")[0]);
            return userRepository.findById(userId);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
