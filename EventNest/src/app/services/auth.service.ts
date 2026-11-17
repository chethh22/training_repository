import { Injectable } from '@angular/core';

export type UserRole = 'Admin' | 'Organizer' | 'Participant';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly roleKey = 'eventnestRole';
  login(role: UserRole): void { sessionStorage.setItem(this.roleKey, role); }
  logout(): void { sessionStorage.removeItem(this.roleKey); }
  getRole(): UserRole | null { return sessionStorage.getItem(this.roleKey) as UserRole | null; }
  isLoggedIn(): boolean { return this.getRole() !== null; }
}
