import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <header class="header">
        <a routerLink="/dashboard" class="back">← Back</a>
      </header>
      <h1>Patients</h1>

      @if (loading) {
        <p>Loading...</p>
      } @else if (patients.length === 0) {
        <p class="empty">No patients found.</p>
      } @else {
        <div class="list">
          @for (p of patients; track p.id) {
            <div class="item">
              <div>
                <strong>{{ p.name }}</strong>
                <span class="email">{{ p.email }}</span>
              </div>
              <a [routerLink]="['/doctor/patient', p.id, 'answers']" class="btn">View Answers</a>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 700px;
      margin: 0 auto;
      padding: 2rem;
    }
    .header {
      margin-bottom: 1.5rem;
    }
    .back {
      color: #3b82f6;
      text-decoration: none;
    }
    .back:hover {
      text-decoration: underline;
    }
    h1 {
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .email {
      display: block;
      font-size: 0.85rem;
      color: #64748b;
      margin-top: 0.25rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.875rem;
    }
    .btn:hover {
      background: #2563eb;
    }
    .empty {
      color: #64748b;
    }
  `]
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }
}
