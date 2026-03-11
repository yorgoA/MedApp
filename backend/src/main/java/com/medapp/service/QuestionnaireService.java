package com.medapp.service;

import com.medapp.dto.CreateQuestionnaireRequest;
import com.medapp.dto.QuestionnaireDto;
import com.medapp.entity.*;
import com.medapp.repository.QuestionnaireAssignmentRepository;
import com.medapp.repository.QuestionnaireRepository;
import com.medapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionnaireService {

    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionnaireAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public QuestionnaireService(QuestionnaireRepository questionnaireRepository,
                                QuestionnaireAssignmentRepository assignmentRepository,
                                UserRepository userRepository) {
        this.questionnaireRepository = questionnaireRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    public List<QuestionnaireDto> getQuestionnairesForPatient(Long patientId) {
        return assignmentRepository.findByPatientIdWithDetails(patientId).stream()
                .map(qa -> QuestionnaireDto.from(qa.getQuestionnaire(), qa.getPatient().getId(), qa.getPatient().getName()))
                .collect(Collectors.toList());
    }

    public List<QuestionnaireDto> getQuestionnairesForDoctor(Long doctorId) {
        return assignmentRepository.findByDoctorId(doctorId).stream()
                .map(qa -> QuestionnaireDto.from(qa.getQuestionnaire(), qa.getPatient().getId(), qa.getPatient().getName()))
                .collect(Collectors.toList());
    }

    public Optional<Questionnaire> getQuestionnaireById(Long id) {
        return questionnaireRepository.findById(id);
    }

    @Transactional
    public QuestionnaireDto createQuestionnaire(CreateQuestionnaireRequest request, User doctor) {
        User patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        if (patient.getRole() != User.Role.PATIENT) {
            throw new IllegalArgumentException("User is not a patient");
        }

        Questionnaire questionnaire = new Questionnaire();
        questionnaire.setTitle(request.getTitle());
        questionnaire.setCreatedBy(doctor);

        if (request.getQuestions() != null) {
            int order = 0;
            for (CreateQuestionnaireRequest.QuestionInput input : request.getQuestions()) {
                Question q = new Question();
                q.setText(input.getText());
                q.setType(Question.QuestionType.valueOf(input.getType()));
                q.setSortOrder(input.getSortOrder() != null ? input.getSortOrder() : order++);
                q.setQuestionnaire(questionnaire);
                questionnaire.getQuestions().add(q);
            }
        }

        questionnaire = questionnaireRepository.save(questionnaire);

        QuestionnaireAssignment assignment = new QuestionnaireAssignment();
        assignment.setQuestionnaire(questionnaire);
        assignment.setPatient(patient);
        assignmentRepository.save(assignment);

        return QuestionnaireDto.from(questionnaire, patient.getId(), patient.getName());
    }
}
