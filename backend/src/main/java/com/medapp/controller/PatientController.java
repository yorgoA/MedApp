package com.medapp.controller;

import com.medapp.dto.PatientDto;
import com.medapp.entity.User;
import com.medapp.service.AuthService;
import com.medapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final UserService userService;
    private final AuthService authService;

    public PatientController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getPatients(@RequestHeader("Authorization") String auth) {
        return authService.validateToken(auth)
                .filter(u -> u.getRole() == User.Role.DOCTOR)
                .map(doctor -> ResponseEntity.ok(userService.getAllPatients()))
                .orElse(ResponseEntity.status(401).build());
    }
}
