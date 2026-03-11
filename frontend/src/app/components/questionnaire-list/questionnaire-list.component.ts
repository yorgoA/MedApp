import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Questionnaire } from '../../models/questionnaire.model';

@Component({
  selector: 'app-questionnaire-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section">
      <h2>Assigned Questionnaires</h2>
      @if (loading) {
        <p>Loading...</p>
      } @else if (questionnaires.length === 0) {
        <p class="empty">No questionnaires assigned yet.</p>
      } @else {
        <div class="list">
          @for (q of questionnaires; track q.id) {
            <div class="item">
              <div>
                <strong>{{ q.title }}</strong>
                <span class="meta">by {{ q.createdByName }}</span>
              </div>
              <a [routerLink]="['/patient/questionnaire', q.id]" class="btn">Fill Out</a>
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .section h2 {
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
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
    .meta {
      display: block;
      font-size: 0.8rem;
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
export class QuestionnaireListComponent implements OnInit {
  questionnaires: Questionnaire[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getQuestionnaires().subscribe({
      next: (data) => {
        this.questionnaires = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }
}
