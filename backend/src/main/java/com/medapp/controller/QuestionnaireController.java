package com.medapp.controller;

import com.medapp.dto.CreateQuestionnaireRequest;
import com.medapp.dto.QuestionnaireDto;
import com.medapp.entity.User;
import com.medapp.service.AuthService;
import com.medapp.service.QuestionnaireService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questionnaires")
public class QuestionnaireController {

    private final QuestionnaireService questionnaireService;
    private final AuthService authService;

    public QuestionnaireController(QuestionnaireService questionnaireService, AuthService authService) {
        this.questionnaireService = questionnaireService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getQuestionnaires(@RequestHeader("Authorization") String auth) {
        return authService.validateToken(auth)
                .map(user -> {
                    List<QuestionnaireDto> list = user.getRole() == User.Role.PATIENT
                            ? questionnaireService.getQuestionnairesForPatient(user.getId())
                            : questionnaireService.getQuestionnairesForDoctor(user.getId());
                    return ResponseEntity.ok(list);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping
    public ResponseEntity<?> createQuestionnaire(
            @RequestHeader("Authorization") String auth,
            @Valid @RequestBody CreateQuestionnaireRequest request) {
        return authService.validateToken(auth)
                .filter(u -> u.getRole() == User.Role.DOCTOR)
                .map(doctor -> ResponseEntity.ok(questionnaireService.createQuestionnaire(request, doctor)))
                .orElse(ResponseEntity.status(401).build());
    }
}
