import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { doctorGuard, patientGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'patient/questionnaire/:id',
        canActivate: [patientGuard],
        loadComponent: () => import('./pages/questionnaire-form/questionnaire-form.component').then(m => m.QuestionnaireFormComponent)
      },
      {
        path: 'patient/history',
        canActivate: [patientGuard],
        loadComponent: () => import('./pages/submission-history/submission-history.component').then(m => m.SubmissionHistoryComponent)
      },
      {
        path: 'doctor/patients',
        canActivate: [doctorGuard],
        loadComponent: () => import('./pages/patient-list/patient-list.component').then(m => m.PatientListComponent)
      },
      {
        path: 'doctor/patient/:id/answers',
        canActivate: [doctorGuard],
        loadComponent: () => import('./pages/patient-answers/patient-answers.component').then(m => m.PatientAnswersComponent)
      },
      {
        path: 'doctor/create-questionnaire',
        canActivate: [doctorGuard],
        loadComponent: () => import('./pages/create-questionnaire/create-questionnaire.component').then(m => m.CreateQuestionnaireComponent)
      },
      {
        path: 'doctor/monitoring',
        canActivate: [doctorGuard],
        loadComponent: () => import('./pages/monitoring-dashboard/monitoring-dashboard.component').then(m => m.MonitoringDashboardComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
