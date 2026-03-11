package com.medapp.dto;

import com.medapp.entity.Questionnaire;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class QuestionnaireDto {

    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private Long createdById;
    private String createdByName;
    private List<QuestionDto> questions;
    private Long patientId;
    private String patientName;

    public QuestionnaireDto() {
    }

    public static QuestionnaireDto from(Questionnaire q) {
        return from(q, null, null);
    }

    public static QuestionnaireDto from(Questionnaire q, Long patientId, String patientName) {
        QuestionnaireDto dto = new QuestionnaireDto();
        dto.setId(q.getId());
        dto.setTitle(q.getTitle());
        dto.setCreatedAt(q.getCreatedAt());
        if (q.getCreatedBy() != null) {
            dto.setCreatedById(q.getCreatedBy().getId());
            dto.setCreatedByName(q.getCreatedBy().getName());
        }
        if (q.getQuestions() != null) {
            dto.setQuestions(q.getQuestions().stream()
                    .sorted((a, b) -> Integer.compare(
                            a.getSortOrder() != null ? a.getSortOrder() : 0,
                            b.getSortOrder() != null ? b.getSortOrder() : 0))
                    .map(QuestionDto::from)
                    .collect(Collectors.toList()));
        }
        dto.setPatientId(patientId);
        dto.setPatientName(patientName);
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public List<QuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDto> questions) {
        this.questions = questions;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }
}
