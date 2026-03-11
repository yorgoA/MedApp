package com.medapp.repository;

import com.medapp.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByPatientIdOrderBySubmittedAtDesc(Long patientId);

    @Query("SELECT a FROM Answer a " +
           "JOIN FETCH a.question q " +
           "JOIN FETCH q.questionnaire " +
           "WHERE a.patient.id = :patientId " +
           "ORDER BY a.submittedAt DESC")
    List<Answer> findByPatientIdWithQuestion(Long patientId);
}
