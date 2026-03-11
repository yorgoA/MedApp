import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Submission } from '../../models/answer.model';

@Component({
  selector: 'app-submission-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <header class="header">
        <a routerLink="/dashboard" class="back">← Back</a>
      </header>
      <h1>Submission History</h1>

      @if (loading) {
        <p>Loading...</p>
      } @else if (submissions.length === 0) {
        <p class="empty">No submissions yet.</p>
      } @else {
        <div class="list">
          @for (s of submissions; track s.submissionId) {
            <div class="card">
              <h3>{{ s.questionnaireTitle }}</h3>
              <p class="date">{{ s.submittedAt | date:'medium' }}</p>
              <div class="answers">
                @for (a of s.answers; track a.questionId) {
                  <div class="answer">
                    <strong>{{ a.questionText }}</strong>
                    <span>{{ a.value }}</span>
                  </div>
                }
              </div>
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
      gap: 1rem;
    }
    .card {
      background: #fff;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .card h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }
    .date {
      margin: 0 0 1rem 0;
      font-size: 0.85rem;
      color: #64748b;
    }
    .answers {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .answer {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .answer strong {
      font-size: 0.875rem;
      color: #64748b;
    }
    .empty {
      color: #64748b;
    }
  `]
})
export class SubmissionHistoryComponent implements OnInit {
  submissions: Submission[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getMySubmissions().subscribe({
      next: (data) => {
        this.submissions = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }
}
