// src/app/services/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const role = localStorage.getItem('currentUserRole'); // 'admin' | 'boutique' | 'client'

    if (role && allowedRoles.includes(role)) {
      return true;
    }

    router.navigate(['/unauthorized']); // ou '/' selon ton choix
    return false;
  };
};