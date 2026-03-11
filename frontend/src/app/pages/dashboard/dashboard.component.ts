import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { QuestionnaireListComponent } from '../../components/questionnaire-list/questionnaire-list.component';
import { DoctorQuestionnaireListComponent } from '../../components/doctor-questionnaire-list/doctor-questionnaire-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, QuestionnaireListComponent, DoctorQuestionnaireListComponent],
  template: `
    <div class="dashboard">
      <header class="header">
        <h1>MedApp</h1>
        <div class="user-info">
          <span>{{ auth.user()?.name }}</span>
          <span class="role">{{ auth.user()?.role }}</span>
          <button (click)="auth.logout()">Logout</button>
        </div>
      </header>

      <main class="dashboard-content">
        @if (auth.isPatient()) {
          <div class="card-grid">
            <a routerLink="/dashboard" class="card">
              <h2>My Questionnaires</h2>
              <p>View and fill out assigned questionnaires</p>
            </a>
            <a routerLink="/patient/history" class="card">
              <h2>Submission History</h2>
              <p>View your past submissions</p>
            </a>
          </div>
          <app-questionnaire-list></app-questionnaire-list>
        }

        @if (auth.isDoctor()) {
          <div class="card-grid">
            <a routerLink="/doctor/patients" class="card">
              <h2>Patients</h2>
              <p>View list of patients</p>
            </a>
            <a routerLink="/doctor/monitoring" class="card">
              <h2>Monitoring Dashboard</h2>
              <p>Monitor patient health trends</p>
            </a>
            <a routerLink="/doctor/create-questionnaire" class="card">
              <h2>Create Questionnaire</h2>
              <p>Assign a new questionnaire to a patient</p>
            </a>
          </div>
          <app-doctor-questionnaire-list></app-doctor-questionnaire-list>
        }
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #f8fafc;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .header h1 {
      margin: 0;
      font-size: 1.5rem;
      color: #0f172a;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .role {
      font-size: 0.875rem;
      color: #64748b;
    }
    .user-info button {
      padding: 0.4rem 0.75rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
    }
    .user-info button:hover {
      background: #dc2626;
    }
    .dashboard-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .card {
      background: #fff;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      text-decoration: none;
      color: inherit;
      transition: box-shadow 0.2s;
    }
    .card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .card h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
    }
    .card p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }
  `]
})
export class DashboardComponent {
  auth = inject(AuthService);
}
