package com.medapp.service;

import com.medapp.dto.PatientDto;
import com.medapp.entity.User;
import com.medapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<PatientDto> getAllPatients() {
        return userRepository.findByRole(User.Role.PATIENT).stream()
                .map(u -> new PatientDto(u.getId(), u.getEmail(), u.getName()))
                .collect(Collectors.toList());
    }

    public Optional<User> getPatientById(Long id) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == User.Role.PATIENT);
    }
}
