import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Patient } from '../../models/patient.model';
import { Submission } from '../../models/answer.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ChartData {
  labels: string[];
  values: number[];
}

@Component({
  selector: 'app-monitoring-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <header class="header">
        <a routerLink="/dashboard" class="back">← Back</a>
      </header>
      <h1>Patient Monitoring Dashboard</h1>

      @if (loading) {
        <p>Loading...</p>
      } @else {
        <div class="patient-select">
          <label for="patient">Select patient:</label>
          <select id="patient" [ngModel]="selectedPatientId" (ngModelChange)="onPatientChange($event)">
            <option [ngValue]="null">-- Choose patient --</option>
            @for (p of patients; track p.id) {
              <option [ngValue]="p.id">{{ p.name }}</option>
            }
          </select>
        </div>

        @if (selectedPatientId && patientName) {
          <h2 class="patient-title">{{ patientName }}</h2>

          @if (submissions.length === 0) {
            <p class="empty">No submissions yet. Ask the patient to fill the questionnaire.</p>
          } @else {
            <div class="charts-grid">
              <div class="chart-card">
                <h3>Pain Level (1-10)</h3>
                <div class="chart-container">
                  <canvas #painChart></canvas>
                </div>
              </div>
              <div class="chart-card">
                <h3>Temperature (°C)</h3>
                <div class="chart-container">
                  <canvas #tempChart></canvas>
                </div>
              </div>
              <div class="chart-card">
                <h3>Heart Rate (1-100)</h3>
                <div class="chart-container">
                  <canvas #heartChart></canvas>
                </div>
              </div>
            </div>

            <div class="symptoms-section">
              <h3>Symptoms over time</h3>
              @if (symptomsList.length === 0) {
                <p class="muted">No symptoms reported.</p>
              } @else {
                <div class="symptoms-list">
                  @for (s of symptomsList; track s.date) {
                    <div class="symptom-item">
                      <span class="date">{{ s.date }}</span>
                      <span class="text">{{ s.text }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }
        }
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 1000px;
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
    .patient-select {
      margin-bottom: 1.5rem;
    }
    .patient-select label {
      display: block;
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }
    .patient-select select {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      min-width: 200px;
    }
    .patient-title {
      font-size: 1.25rem;
      margin: 0 0 1.5rem 0;
      color: #0f172a;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .chart-card {
      background: #fff;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .chart-card h3 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      color: #64748b;
    }
    .chart-container {
      position: relative;
      height: 200px;
    }
    .symptoms-section {
      background: #fff;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .symptoms-section h3 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      color: #64748b;
    }
    .symptoms-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .symptom-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .symptom-item .date {
      font-size: 0.8rem;
      color: #64748b;
    }
    .symptom-item .text {
      font-size: 0.95rem;
    }
    .empty, .muted {
      color: #64748b;
    }
  `]
})
export class MonitoringDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('painChart') painChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tempChart') tempChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heartChart') heartChartRef!: ElementRef<HTMLCanvasElement>;

  patients: Patient[] = [];
  submissions: Submission[] = [];
  patientName = '';
  selectedPatientId: number | null = null;
  loading = true;
  symptomsList: { date: string; text: string }[] = [];

  private painChart: Chart | null = null;
  private tempChart: Chart | null = null;
  private heartChart: Chart | null = null;

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

  ngAfterViewInit(): void {
    // Charts will be created when patient is selected
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  onPatientChange(patientId: number | null): void {
    this.selectedPatientId = patientId;
    this.destroyCharts();
    if (!patientId) {
      this.submissions = [];
      this.patientName = '';
      return;
    }
    const p = this.patients.find((x) => x.id === patientId);
    this.patientName = p?.name ?? 'Patient';
    this.api.getAnswersByPatient(patientId).subscribe({
      next: (data) => {
        this.submissions = data;
        this.buildSymptomsList();
        setTimeout(() => this.buildCharts(), 0);
      }
    });
  }

  private buildCharts(): void {
    this.destroyCharts();
    if (this.submissions.length === 0) return;

    const pain = this.extractData('PAIN_LEVEL');
    const temp = this.extractData('TEMPERATURE');
    const heart = this.extractData('HEART_RATE');

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    };

    if (this.painChartRef?.nativeElement && pain.labels.length > 0) {
      this.painChart = new Chart(this.painChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: pain.labels,
          datasets: [{
            data: pain.values,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.3,
            fill: true
          }]
        },
        options: chartOptions
      });
    }

    if (this.tempChartRef?.nativeElement && temp.labels.length > 0) {
      this.tempChart = new Chart(this.tempChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: temp.labels,
          datasets: [{
            data: temp.values,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.3,
            fill: true
          }]
        },
        options: chartOptions
      });
    }

    if (this.heartChartRef?.nativeElement && heart.labels.length > 0) {
      this.heartChart = new Chart(this.heartChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: heart.labels,
          datasets: [{
            data: heart.values,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true
          }]
        },
        options: chartOptions
      });
    }
  }

  private extractData(questionType: string): ChartData {
    const labels: string[] = [];
    const values: number[] = [];
    for (const s of this.submissions) {
      const ans = s.answers.find((a) => a.questionType === questionType);
      if (ans) {
        const num = parseFloat(ans.value);
        if (!isNaN(num)) {
          labels.push(new Date(s.submittedAt).toLocaleDateString());
          values.push(num);
        }
      }
    }
    return { labels, values };
  }

  private buildSymptomsList(): void {
    this.symptomsList = [];
    for (const s of this.submissions) {
      const ans = s.answers.find((a) => a.questionType === 'SYMPTOMS');
      if (ans?.value?.trim()) {
        this.symptomsList.push({
          date: new Date(s.submittedAt).toLocaleString(),
          text: ans.value
        });
      }
    }
  }

  private destroyCharts(): void {
    this.painChart?.destroy();
    this.tempChart?.destroy();
    this.heartChart?.destroy();
    this.painChart = this.tempChart = this.heartChart = null;
  }
}
