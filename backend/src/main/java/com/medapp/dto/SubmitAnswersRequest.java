package com.medapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class SubmitAnswersRequest {

    @NotNull(message = "Questionnaire ID is required")
    private Long questionnaireId;

    @Valid
    private List<AnswerInput> answers;

    public static class AnswerInput {
        @NotNull(message = "Question ID is required")
        private Long questionId;

        @NotNull(message = "Value is required")
        private String value;

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }
    }

    public Long getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Long questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public List<AnswerInput> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerInput> answers) {
        this.answers = answers;
    }
}
