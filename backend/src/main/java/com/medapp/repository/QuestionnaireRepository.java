package com.medapp.repository;

import com.medapp.entity.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {

    @Query("SELECT DISTINCT q FROM Questionnaire q " +
           "JOIN FETCH q.questions " +
           "JOIN FETCH q.createdBy " +
           "WHERE q.id IN (SELECT qa.questionnaire.id FROM QuestionnaireAssignment qa WHERE qa.patient.id = :patientId)")
    List<Questionnaire> findByPatientId(Long patientId);
}
