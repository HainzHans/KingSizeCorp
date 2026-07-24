import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth-service/auth-service';

/** Lässt jeden eingeloggten Besucher durch – Admin wie User. */
export const authGuard = async () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (await auth.loadSession()) {
    return true;
  }

  await router.navigate(['/login']);
  return false;
};
