package com.medapp.controller;

import com.medapp.dto.SubmissionDto;
import com.medapp.dto.SubmitAnswersRequest;
import com.medapp.entity.User;
import com.medapp.service.AnswerService;
import com.medapp.service.AuthService;
import com.medapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {

    private final AnswerService answerService;
    private final AuthService authService;
    private final UserService userService;

    public AnswerController(AnswerService answerService, AuthService authService, UserService userService) {
        this.answerService = answerService;
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> submitAnswers(
            @RequestHeader("Authorization") String auth,
            @Valid @RequestBody SubmitAnswersRequest request) {
        return authService.validateToken(auth)
                .filter(u -> u.getRole() == User.Role.PATIENT)
                .map(patient -> ResponseEntity.ok(answerService.submitAnswers(request, patient)))
                .orElse(ResponseEntity.status(401).build());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMySubmissions(@RequestHeader("Authorization") String auth) {
        return authService.validateToken(auth)
                .filter(u -> u.getRole() == User.Role.PATIENT)
                .map(patient -> ResponseEntity.ok(answerService.getSubmissionsByPatient(patient.getId())))
                .orElse(ResponseEntity.status(401).build());
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<?> getAnswersByPatient(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long patientId) {
        return authService.validateToken(auth)
                .filter(u -> u.getRole() == User.Role.DOCTOR)
                .filter(doctor -> userService.getPatientById(patientId).isPresent())
                .map(doctor -> ResponseEntity.ok(answerService.getSubmissionsByPatient(patientId)))
                .orElse(ResponseEntity.status(401).build());
    }
}
