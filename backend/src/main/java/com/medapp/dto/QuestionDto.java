package com.medapp.dto;

import com.medapp.entity.Question;

public class QuestionDto {

    private Long id;
    private String text;
    private String type;
    private Integer sortOrder;

    public QuestionDto() {
    }

    public static QuestionDto from(Question q) {
        QuestionDto dto = new QuestionDto();
        dto.setId(q.getId());
        dto.setText(q.getText());
        dto.setType(q.getType().name());
        dto.setSortOrder(q.getSortOrder());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
