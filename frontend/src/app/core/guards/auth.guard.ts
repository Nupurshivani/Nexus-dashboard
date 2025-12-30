import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = localStorage.getItem('token');
    const user = authService.currentUser;

    if (token && user) {
        // Check if route requires admin access
        const requiresAdmin = route.data?.['requiresAdmin'];

        if (requiresAdmin && !authService.isAdmin) {
            // User is authenticated but not an admin
            router.navigate(['/dashboard']);
            return false;
        }

        return true;
    }

    // Not authenticated - redirect to login
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
    });
    return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const token = localStorage.getItem('token');

    if (token) {
        // Already authenticated - redirect to dashboard
        router.navigate(['/dashboard']);
        return false;
    }

    return true;
};
