import { Injectable, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  readonly isLoggedIn = signal<boolean>(false);
  readonly userName = signal<string | null>(null);

  constructor(private authService: AuthService) {
    const isLoggedIn = this.authService.isLoggedIn();
    this.isLoggedIn.set(isLoggedIn);

    if (isLoggedIn) {
      const token = this.authService.getToken();
      const payload = token ? this.decodeToken(token) : null;
      if (payload?.sub) {
        this.userName.set(payload.sub);
      }
    }
  }

  login(token: string): void {
    this.authService.saveToken(token);
    this.isLoggedIn.set(true);
    const payload = this.decodeToken(token);
    this.userName.set(payload?.sub ?? null);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn.set(false);
    this.userName.set(null);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}