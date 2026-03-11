import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Patient } from '../../models/patient.model';

const DEFAULT_QUESTIONS = [
  { text: 'Rate your pain level (1-10)', type: 'PAIN_LEVEL' },
  { text: 'What is your temperature today? (°C)', type: 'TEMPERATURE' },
  { text: 'How much does the heart monitor indicate? (1-100)', type: 'HEART_RATE' },
  { text: 'Describe any symptoms you\'re experiencing', type: 'SYMPTOMS' }
];

@Component({
  selector: 'app-create-questionnaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <header class="header">
        <a routerLink="/dashboard" class="back">← Back</a>
      </header>
      <h1>Create Questionnaire</h1>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" formControlName="title" placeholder="e.g. Daily Health Check" />
          @if (form.get('title')?.invalid && form.get('title')?.touched) {
            <span class="error">Required</span>
          }
        </div>
        <div class="form-group">
          <label for="patientId">Patient</label>
          <select id="patientId" formControlName="patientId">
            <option value="">Select patient</option>
            @for (p of patients; track p.id) {
              <option [value]="p.id">{{ p.name }} ({{ p.email }})</option>
            }
          </select>
          @if (form.get('patientId')?.invalid && form.get('patientId')?.touched) {
            <span class="error">Required</span>
          }
        </div>

        <h3>Questions</h3>
        <div formArrayName="questions">
          @for (q of questions.controls; track $index; let i = $index) {
            <div class="question-row" [formGroupName]="i">
              <input formControlName="text" placeholder="Question text" />
              <select formControlName="type">
                <option value="PAIN_LEVEL">Pain Level (1-10)</option>
                <option value="TEMPERATURE">Temperature</option>
                <option value="HEART_RATE">Heart Monitor (1-100)</option>
                <option value="SYMPTOMS">Symptoms</option>
              </select>
            </div>
          }
        </div>

        @if (errorMessage) {
          <div class="error">{{ errorMessage }}</div>
        }
        <button type="submit" [disabled]="form.invalid || submitting">Create</button>
      </form>
    </div>
  `,
  styles: [`
    .page {
      max-width: 600px;
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
    h3 {
      margin: 1.5rem 0 0.75rem 0;
      font-size: 1.1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    input, select {
      width: 100%;
      padding: 0.6rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
    }
    .question-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }
    .question-row input {
      flex: 2;
    }
    .question-row select {
      flex: 1;
      min-width: 140px;
    }
    .error {
      color: #dc2626;
      margin: 10px 0;
    }
    button {
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class CreateQuestionnaireComponent implements OnInit {
  form!: FormGroup;
  patients: Patient[] = [];
  loading = true;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      title: ['', Validators.required],
      patientId: ['', Validators.required],
      questions: this.fb.array(
        DEFAULT_QUESTIONS.map((q) =>
          this.fb.group({
            text: [q.text, Validators.required],
            type: [q.type, Validators.required]
          })
        )
      )
    });
    this.api.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.errorMessage = '';
    const value = this.form.getRawValue();
    const req = {
      title: value.title,
      patientId: +value.patientId,
      questions: value.questions.map((q: { text: string; type: string }, i: number) => ({
        text: q.text,
        type: q.type,
        sortOrder: i
      }))
    };
    this.api.createQuestionnaire(req).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.error || 'Failed to create questionnaire';
      }
    });
  }
}
