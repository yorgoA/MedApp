import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Patient } from '../models/patient.model';
import { Questionnaire, CreateQuestionnaireRequest } from '../models/questionnaire.model';
import { Submission, SubmitAnswersRequest } from '../models/answer.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private headers() {
    return this.auth.getAuthHeaders();
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${API_URL}/patients`, {
      headers: this.headers()
    });
  }

  getQuestionnaires(): Observable<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(`${API_URL}/questionnaires`, {
      headers: this.headers()
    });
  }

  createQuestionnaire(req: CreateQuestionnaireRequest): Observable<Questionnaire> {
    return this.http.post<Questionnaire>(`${API_URL}/questionnaires`, req, {
      headers: this.headers()
    });
  }

  submitAnswers(req: SubmitAnswersRequest): Observable<Submission> {
    return this.http.post<Submission>(`${API_URL}/answers`, req, {
      headers: this.headers()
    });
  }

  getAnswersByPatient(patientId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${API_URL}/answers/${patientId}`, {
      headers: this.headers()
    });
  }

  getMySubmissions(): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${API_URL}/answers/me`, {
      headers: this.headers()
    });
  }
}
