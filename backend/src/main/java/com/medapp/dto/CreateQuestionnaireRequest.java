package com.medapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class CreateQuestionnaireRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @Valid
    private List<QuestionInput> questions;

    public static class QuestionInput {
        @NotBlank(message = "Question text is required")
        private String text;

        @NotBlank(message = "Question type is required")
        private String type;  // PAIN_LEVEL, TEMPERATURE, HEART_RATE, SYMPTOMS

        private Integer sortOrder = 0;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Integer getSortOrder() {
            return sortOrder;
        }

        public void setSortOrder(Integer sortOrder) {
            this.sortOrder = sortOrder;
        }
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public List<QuestionInput> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionInput> questions) {
        this.questions = questions;
    }
}
