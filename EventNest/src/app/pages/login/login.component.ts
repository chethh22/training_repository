import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <main class="login-page">
      <section class="login-card">
        <div class="brand-mark">E</div>
        <p class="eyebrow">YOUR NEIGHBOURHOOD, IN ONE PLACE</p>
        <h1>Welcome to EventNest</h1>
        <p class="muted">Choose a demo role to explore community events.</p>
        <button class="role-button" (click)="login('Admin')"><b>Admin</b><small>Manage the event hub</small></button>
        <button class="role-button" (click)="login('Organizer')"><b>Organizer</b><small>Create and manage events</small></button>
        <button class="role-button" (click)="login('Participant')"><b>Participant</b><small>Discover upcoming events</small></button>
        <p class="fine-print">Demo login for learning purposes only.</p>
      </section>
    </main>
  `,
  styles: [`
    .login-page{min-height:100vh;display:grid;place-items:center;padding:24px}
    .login-card{width:min(100%,470px);padding:42px;background:white;border:1px solid #e7e9f0;border-radius:24px;box-shadow:0 24px 70px #20284a12}
    .brand-mark{width:48px;height:48px;display:grid;place-items:center;border-radius:15px;background:#5b5ce2;color:white;font-weight:800;font-size:24px}
    .eyebrow{margin:24px 0 8px;color:#6869ce;font-size:11px;letter-spacing:1.6px;font-weight:800}
    h1{font-size:30px;margin:0 0 8px}.muted,.fine-print{color:#777d91}
    .role-button{width:100%;display:flex;flex-direction:column;gap:4px;text-align:left;padding:15px 18px;margin-top:12px;border:1px solid #e5e7ef;border-radius:13px;background:white;cursor:pointer;color:#22263a}
    .role-button:hover{border-color:#7778e8;background:#f8f8ff}.role-button small{color:#777d91}
    .fine-print{text-align:center;font-size:11px;margin:22px 0 0}
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  login(role: UserRole): void {
    this.authService.login(role);
    this.router.navigate(['/dashboard']);
  }
}
