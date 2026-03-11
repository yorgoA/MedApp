package com.medapp.service;

import com.medapp.dto.AnswerDetailDto;
import com.medapp.dto.SubmissionDto;
import com.medapp.dto.SubmitAnswersRequest;
import com.medapp.entity.Answer;
import com.medapp.entity.Question;
import com.medapp.entity.Questionnaire;
import com.medapp.entity.User;
import com.medapp.repository.AnswerRepository;
import com.medapp.repository.QuestionnaireAssignmentRepository;
import com.medapp.repository.QuestionnaireRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionnaireAssignmentRepository assignmentRepository;

    public AnswerService(AnswerRepository answerRepository,
                         QuestionnaireRepository questionnaireRepository,
                         QuestionnaireAssignmentRepository assignmentRepository) {
        this.answerRepository = answerRepository;
        this.questionnaireRepository = questionnaireRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @Transactional
    public SubmissionDto submitAnswers(SubmitAnswersRequest request, User patient) {
        Questionnaire questionnaire = questionnaireRepository.findById(request.getQuestionnaireId())
                .orElseThrow(() -> new IllegalArgumentException("Questionnaire not found"));

        if (assignmentRepository.findByQuestionnaireIdAndPatientId(questionnaire.getId(), patient.getId()).isEmpty()) {
            throw new IllegalArgumentException("Questionnaire not assigned to this patient");
        }

        long submissionId = System.currentTimeMillis();
        java.time.LocalDateTime submittedAt = java.time.LocalDateTime.now();

        SubmissionDto dto = new SubmissionDto();
        dto.setSubmissionId(submissionId);
        dto.setSubmittedAt(submittedAt);
        dto.setQuestionnaireId(questionnaire.getId());
        dto.setQuestionnaireTitle(questionnaire.getTitle());

        if (request.getAnswers() != null) {
            Map<Long, String> answerMap = request.getAnswers().stream()
                    .collect(Collectors.toMap(SubmitAnswersRequest.AnswerInput::getQuestionId,
                            SubmitAnswersRequest.AnswerInput::getValue));

            List<AnswerDetailDto> answerDtos = new java.util.ArrayList<>();
            for (Question q : questionnaire.getQuestions()) {
                String value = answerMap.get(q.getId());
                if (value != null && !value.isBlank()) {
                    Answer answer = new Answer();
                    answer.setQuestion(q);
                    answer.setPatient(patient);
                    answer.setValue(value.trim());
                    answer.setSubmissionId(submissionId);
                    answer.setSubmittedAt(submittedAt);
                    answerRepository.save(answer);

                    AnswerDetailDto ad = new AnswerDetailDto();
                    ad.setQuestionId(q.getId());
                    ad.setQuestionText(q.getText());
                    ad.setQuestionType(q.getType().name());
                    ad.setValue(value.trim());
                    answerDtos.add(ad);
                }
            }
            dto.setAnswers(answerDtos);
        }
        return dto;
    }

    public List<SubmissionDto> getSubmissionsByPatient(Long patientId) {
        List<Answer> answers = answerRepository.findByPatientIdWithQuestion(patientId);
        return answers.stream()
                .collect(Collectors.groupingBy(Answer::getSubmissionId))
                .entrySet().stream()
                .map(entry -> {
                    Answer first = entry.getValue().get(0);
                    SubmissionDto dto = new SubmissionDto();
                    dto.setSubmissionId(entry.getKey());
                    dto.setSubmittedAt(first.getSubmittedAt());
                    dto.setQuestionnaireId(first.getQuestion().getQuestionnaire().getId());
                    dto.setQuestionnaireTitle(first.getQuestion().getQuestionnaire().getTitle());
                    dto.setAnswers(entry.getValue().stream()
                            .map(a -> {
                                AnswerDetailDto ad = new AnswerDetailDto();
                                ad.setQuestionId(a.getQuestion().getId());
                                ad.setQuestionText(a.getQuestion().getText());
                                ad.setQuestionType(a.getQuestion().getType().name());
                                ad.setValue(a.getValue());
                                return ad;
                            })
                            .collect(Collectors.toList()));
                    return dto;
                })
                .sorted((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()))
                .collect(Collectors.toList());
    }
}
