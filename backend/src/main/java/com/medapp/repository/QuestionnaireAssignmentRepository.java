package com.medapp.repository;

import com.medapp.entity.QuestionnaireAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface QuestionnaireAssignmentRepository extends JpaRepository<QuestionnaireAssignment, Long> {

    List<QuestionnaireAssignment> findByPatientId(Long patientId);

    Optional<QuestionnaireAssignment> findByQuestionnaireIdAndPatientId(Long questionnaireId, Long patientId);

    @Query("SELECT qa FROM QuestionnaireAssignment qa " +
           "JOIN FETCH qa.questionnaire q " +
           "JOIN FETCH q.questions " +
           "JOIN FETCH q.createdBy " +
           "JOIN FETCH qa.patient " +
           "WHERE qa.patient.id = :patientId")
    List<QuestionnaireAssignment> findByPatientIdWithDetails(Long patientId);

    @Query("SELECT qa FROM QuestionnaireAssignment qa " +
           "JOIN FETCH qa.questionnaire q " +
           "JOIN FETCH q.questions " +
           "JOIN FETCH q.createdBy " +
           "JOIN FETCH qa.patient " +
           "WHERE q.createdBy.id = :doctorId")
    List<QuestionnaireAssignment> findByDoctorId(Long doctorId);
}
