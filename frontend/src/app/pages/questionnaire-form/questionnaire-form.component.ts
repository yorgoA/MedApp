import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Questionnaire } from '../../models/questionnaire.model';

@Component({
  selector: 'app-questionnaire-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <header class="header">
        <a routerLink="/dashboard" class="back">← Back</a>
        <button (click)="submit()" [disabled]="form.invalid || submitting">Submit</button>
      </header>

      @if (loading) {
        <p>Loading...</p>
      } @else if (!questionnaire) {
        <p>Questionnaire not found.</p>
      } @else {
        <h1>{{ questionnaire.title }}</h1>
        <form [formGroup]="form" class="form">
          @for (q of questionnaire.questions; track q.id; let i = $index) {
            <div class="form-group">
              <label [for]="'q' + q.id">{{ q.text }}</label>
              @if (q.type === 'PAIN_LEVEL') {
                <input [id]="'q' + q.id" type="number" min="1" max="10"
                  [formControlName]="'q_' + q.id" placeholder="1-10" />
              } @else if (q.type === 'TEMPERATURE') {
                <input [id]="'q' + q.id" type="text"
                  [formControlName]="'q_' + q.id" placeholder="e.g. 36.5" />
              } @else if (q.type === 'HEART_RATE') {
                <input [id]="'q' + q.id" type="number" min="1" max="100"
                  [formControlName]="'q_' + q.id" placeholder="1-100" />
              } @else {
                <textarea [id]="'q' + q.id" rows="3"
                  [formControlName]="'q_' + q.id" [placeholder]="q.text"></textarea>
              }
              @if (form.get('q_' + q.id)?.invalid && form.get('q_' + q.id)?.touched) {
                <span class="error">Required</span>
              }
            </div>
          }
        </form>
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    .back {
      color: #3b82f6;
      text-decoration: none;
    }
    .back:hover {
      text-decoration: underline;
    }
    .header button {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .header button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    h1 {
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    input, textarea {
      width: 100%;
      padding: 0.6rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
    }
    .error {
      color: #dc2626;
      font-size: 0.8rem;
    }
  `]
})
export class QuestionnaireFormComponent implements OnInit {
  questionnaire: Questionnaire | null = null;
  form!: FormGroup;
  loading = true;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }
    this.api.getQuestionnaires().subscribe({
      next: (list) => {
        this.questionnaire = list.find((q) => q.id === +id) ?? null;
        if (this.questionnaire) {
          const group: Record<string, unknown> = {};
          for (const q of this.questionnaire.questions) {
            group['q_' + q.id] = ['', Validators.required];
          }
          this.form = this.fb.group(group);
        }
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  submit(): void {
    if (!this.questionnaire || this.form.invalid) return;
    this.submitting = true;
    const answers = this.questionnaire.questions.map((q) => ({
      questionId: q.id,
      value: String(this.form.get('q_' + q.id)?.value ?? '')
    }));
    this.api.submitAnswers({
      questionnaireId: this.questionnaire.id,
      answers
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/patient/history']);
      },
      error: () => (this.submitting = false)
    });
  }
}
