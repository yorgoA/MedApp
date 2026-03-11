import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const doctorGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isDoctor()) return true;
  router.navigate(['/']);
  return false;
};

export const patientGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isPatient()) return true;
  router.navigate(['/']);
  return false;
};
