package com.medapp.dto;

import java.time.LocalDateTime;
import java.util.List;

public class SubmissionDto {

    private Long submissionId;
    private LocalDateTime submittedAt;
    private Long questionnaireId;
    private String questionnaireTitle;
    private List<AnswerDetailDto> answers;

    public SubmissionDto() {
    }

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Long getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Long questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public String getQuestionnaireTitle() {
        return questionnaireTitle;
    }

    public void setQuestionnaireTitle(String questionnaireTitle) {
        this.questionnaireTitle = questionnaireTitle;
    }

    public List<AnswerDetailDto> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerDetailDto> answers) {
        this.answers = answers;
    }
}
