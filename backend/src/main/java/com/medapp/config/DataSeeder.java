package com.medapp.config;

import com.medapp.entity.*;
import com.medapp.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionnaireAssignmentRepository assignmentRepository;
    private final AnswerRepository answerRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public DataSeeder(UserRepository userRepository,
                      QuestionnaireRepository questionnaireRepository,
                      QuestionnaireAssignmentRepository assignmentRepository,
                      AnswerRepository answerRepository) {
        this.userRepository = userRepository;
        this.questionnaireRepository = questionnaireRepository;
        this.assignmentRepository = assignmentRepository;
        this.answerRepository = answerRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Drop old constraint (allowed MEDICATION, not HEART_RATE)
        try {
            entityManager.createNativeQuery("ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_type_check").executeUpdate();
        } catch (Exception ignored) { /* constraint may not exist */ }

        // Delete all data (avoids loading entities with deprecated enum values)
        entityManager.createNativeQuery("DELETE FROM answers").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM questionnaire_assignments").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM questions").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM questionnaires").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM users").executeUpdate();

        // Add new constraint matching current QuestionType enum
        try {
            entityManager.createNativeQuery("ALTER TABLE questions ADD CONSTRAINT questions_type_check CHECK (type IN ('PAIN_LEVEL', 'TEMPERATURE', 'HEART_RATE', 'SYMPTOMS'))").executeUpdate();
        } catch (Exception ignored) { /* constraint may already exist */ }
        entityManager.flush();
        entityManager.clear();

        User doctor = new User("yorgoDR@hotmail.com", "Test123!", "Dr. Yorgo", User.Role.DOCTOR);
        User patient1 = new User("jennifer@hotmail.com", "Test123!", "Jennifer", User.Role.PATIENT);
        User patient2 = new User("nancy@hotmail.com", "Test123!", "Nancy", User.Role.PATIENT);

        userRepository.saveAll(List.of(doctor, patient1, patient2));

        Questionnaire questionnaire = createQuestionnaire("Daily Health Monitoring", doctor,
                "Rate your pain level (1-10)", "PAIN_LEVEL",
                "What is your temperature today? (°C)", "TEMPERATURE",
                "How much does the heart monitor indicate? (1-100)", "HEART_RATE",
                "Describe any symptoms you're experiencing", "SYMPTOMS");

        questionnaire = questionnaireRepository.save(questionnaire);

        saveAssignment(questionnaire, patient1);
        saveAssignment(questionnaire, patient2);
    }

    private void saveAssignment(Questionnaire q, User patient) {
        QuestionnaireAssignment a = new QuestionnaireAssignment();
        a.setQuestionnaire(q);
        a.setPatient(patient);
        assignmentRepository.save(a);
    }

    private Questionnaire createQuestionnaire(String title, User doctor,
                                              String q1Text, String q1Type,
                                              String q2Text, String q2Type,
                                              String q3Text, String q3Type,
                                              String q4Text, String q4Type) {
        Questionnaire q = new Questionnaire();
        q.setTitle(title);
        q.setCreatedBy(doctor);

        Question q1 = new Question();
        q1.setText(q1Text);
        q1.setType(Question.QuestionType.valueOf(q1Type));
        q1.setSortOrder(0);
        q1.setQuestionnaire(q);
        q.getQuestions().add(q1);

        Question q2 = new Question();
        q2.setText(q2Text);
        q2.setType(Question.QuestionType.valueOf(q2Type));
        q2.setSortOrder(1);
        q2.setQuestionnaire(q);
        q.getQuestions().add(q2);

        Question q3 = new Question();
        q3.setText(q3Text);
        q3.setType(Question.QuestionType.valueOf(q3Type));
        q3.setSortOrder(2);
        q3.setQuestionnaire(q);
        q.getQuestions().add(q3);

        Question q4 = new Question();
        q4.setText(q4Text);
        q4.setType(Question.QuestionType.valueOf(q4Type));
        q4.setSortOrder(3);
        q4.setQuestionnaire(q);
        q.getQuestions().add(q4);

        return q;
    }
}
