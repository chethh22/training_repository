
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { CommunityEvent } from '../../models/event.model';
import { EventCardComponent } from '../../components/event-card/event-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCardComponent],

  template: `
    <div class="shell">

      <header class="topbar">
        <a class="brand" href="/dashboard">
          <span>E</span> EventNest
        </a>

        <div>
          <span class="role">{{ role }}</span>
          <button class="logout" (click)="logout()">Log out</button>
        </div>
      </header>

      <main class="content">

        <section class="hero">
          <div>
            <p class="eyebrow">COMMUNITY EVENTS</p>

            <h1>
              Find your next<br>
              <span>great experience.</span>
            </h1>

            <p class="intro">
              Local meetups, friendly competitions and fresh ideas
              — all in one place.
            </p>
          </div>

          <div class="hero-art">
            <div class="orb"></div>
            <div class="floating">
              ✦
              <small>Meet · Learn · Play</small>
            </div>
          </div>
        </section>

        <section class="heading">
          <div>
            <p class="eyebrow">HANDPICKED FOR YOU</p>
            <h2>Upcoming events</h2>
          </div>

          <span>{{ events.length }} events</span>
        </section>

        <div class="actions" *ngIf="canManageEvents">
          <button class="add-btn" (click)="openAddForm()">
            + Add New Event
          </button>
        </div>

        <!-- Add / Edit form -->
        <section class="form-card" *ngIf="showForm">

          <h2>{{ editingId ? 'Edit Event' : 'Add a New Event' }}</h2>

          <form (ngSubmit)="saveEvent()">

            <div class="form-group">
              <label>Event Name</label>
              <input
                type="text"
                name="title"
                [(ngModel)]="newEvent.title"
                placeholder="Enter event name"
                required>
            </div>

            <div class="form-group">
              <label>Category</label>
              <select
                name="category"
                [(ngModel)]="newEvent.category"
                required>

                <option value="" disabled>Select category</option>
                <option value="Sports">Sports</option>
                <option value="Technology">Technology</option>
                <option value="Community">Community</option>
              </select>
            </div>

            <div class="form-group">
              <label>Event Date</label>
              <input
                type="date"
                name="date"
                [(ngModel)]="newEvent.date"
                required>
            </div>

            <div class="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                [(ngModel)]="newEvent.location"
                placeholder="Enter event location"
                required>
            </div>

            <div class="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                [(ngModel)]="newEvent.description"
                placeholder="Describe your event"
                rows="4"
                required>
              </textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn">
                {{ editingId ? 'Update Event' : 'Save Event' }}
              </button>

              <button
                type="button"
                class="cancel-btn"
                (click)="cancelForm()">
                Cancel
              </button>
            </div>

          </form>
        </section>

        <!-- Event cards -->
        <section class="event-grid">

          <app-event-card
            *ngFor="let event of events"
            [event]="event"
            [canEdit]="canManageEvents"
            (edit)="editEvent($event)"
            (delete)="deleteEvent($event)">
          </app-event-card>

        </section>

        <aside class="note" *ngIf="canManageEvents">
          <b>Organizer tools enabled</b>
          <p>
            You are signed in with event-management access
            in this demo.
          </p>
        </aside>

      </main>
    </div>
  `,

  styles: [`
    .shell {
      min-height: 100vh;
      background: #f7f8fc;
    }

    .topbar {
      height: 76px;
      padding: 0 max(6vw, 24px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      border-bottom: 1px solid #eceef4;
    }

    .brand {
      color: #24283d;
      text-decoration: none;
      font-weight: 850;
      font-size: 20px;
    }

    .brand span {
      display: inline-grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: #5b5ce2;
      color: white;
      margin-right: 8px;
    }

    .role {
      background: #eeefff;
      color: #5556c9;
      border-radius: 30px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 750;
    }

    .logout {
      border: 0;
      background: transparent;
      color: #656b7e;
      cursor: pointer;
      margin-left: 14px;
      font-weight: 650;
    }

    .content {
      max-width: 1120px;
      margin: auto;
      padding: 50px 24px 70px;
    }

    .hero {
      background: #25284c;
      color: white;
      border-radius: 25px;
      padding: 45px 52px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 270px;
      overflow: hidden;
    }

    .eyebrow {
      color: #8586f0;
      letter-spacing: 1.6px;
      font-size: 11px;
      font-weight: 850;
      margin: 0 0 10px;
    }

    h1 {
      font-size: 42px;
      line-height: 1.08;
      letter-spacing: -1.8px;
      margin: 0;
    }

    h1 span {
      color: #a7a7ff;
    }

    .intro {
      color: #c5c7dc;
      max-width: 420px;
      line-height: 1.6;
      margin: 16px 0 0;
    }

    .hero-art {
      width: 230px;
      height: 180px;
      position: relative;
      display: grid;
      place-items: center;
    }

    .orb {
      width: 145px;
      height: 145px;
      background: #7778eb;
      border-radius: 50%;
    }

    .floating {
      position: absolute;
      background: white;
      color: #5c5dd1;
      padding: 22px 28px;
      border-radius: 16px;
      transform: rotate(-8deg);
      font-size: 34px;
      font-weight: 900;
      text-align: center;
      box-shadow: 0 15px 35px #10122c55;
    }

    .floating small {
      display: block;
      font-size: 10px;
      color: #565b77;
      white-space: nowrap;
    }

    .heading {
      display: flex;
      justify-content: space-between;
      align-items: end;
      margin: 42px 0 20px;
    }

    h2 {
      margin: 0;
      font-size: 26px;
    }

    .heading > span {
      color: #85899a;
      font-size: 13px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }

    .add-btn, .save-btn {
      background: #5b5ce2;
      color: white;
      border: none;
      border-radius: 9px;
      padding: 12px 20px;
      font-weight: 700;
      cursor: pointer;
    }

    .add-btn:hover, .save-btn:hover {
      background: #4546c4;
    }

    .form-card {
      background: white;
      border: 1px solid #e7e8f1;
      border-radius: 18px;
      padding: 28px;
      margin-bottom: 28px;
      box-shadow: 0 8px 25px #24284c0b;
    }

    .form-card h2 {
      margin-bottom: 22px;
      font-size: 22px;
    }

    form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 13px;
      font-weight: 700;
      color: #42465b;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #dfe1eb;
      border-radius: 9px;
      padding: 12px;
      font: inherit;
      font-size: 14px;
      outline: none;
      background: white;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #5b5ce2;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      gap: 12px;
    }

    .cancel-btn {
      background: #f0f1f6;
      color: #55596b;
      border: none;
      border-radius: 9px;
      padding: 12px 20px;
      font-weight: 700;
      cursor: pointer;
    }

    .event-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }

    .note {
      margin-top: 28px;
      padding: 20px 24px;
      border: 1px solid #e4e5f3;
      border-radius: 16px;
      background: white;
    }

    .note p {
      margin: 5px 0 0;
      color: #7b8092;
      font-size: 13px;
    }

    @media (max-width: 760px) {
      .hero {
        padding: 32px 26px;
      }

      .hero-art {
        display: none;
      }

      .event-grid {
        grid-template-columns: 1fr;
      }

      form {
        grid-template-columns: 1fr;
      }

      .full-width, .form-actions {
        grid-column: auto;
      }

      h1 {
        font-size: 34px;
      }
    }
  `]
})

export class DashboardComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly eventService = inject(EventService);
  private readonly router = inject(Router);

  role = this.authService.getRole() ?? 'Participant';

  get canManageEvents(): boolean {
    return this.role === 'Admin' || this.role === 'Organizer';
  }

  events: CommunityEvent[] = [];

  showForm = false;

  editingId: string | null = null;

  newEvent: CommunityEvent = {
    title: '',
    category: '',
    date: '',
    location: '',
    description: ''
  };

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (error) => {
        console.error('Error loading events:', error);
      }
    });
  }

  openAddForm(): void {
    this.cancelForm();
    this.showForm = true;
  }

  addEvent(): void {
    this.eventService.addEvent(this.newEvent).subscribe({
      next: (savedEvent) => {
        this.events = [...this.events, savedEvent];
        this.cancelForm();
        alert('Event added successfully!');
      },
      error: (error) => {
        console.error('Error adding event:', error);
        alert('Unable to add event.');
      }
    });
  }

  editEvent(event: CommunityEvent): void {
    if (!event.id) {
      return;
    }

    this.editingId = event.id;

    this.newEvent = {
      title: event.title,
      category: event.category,
      date: event.date,
      location: event.location,
      description: event.description
    };

    this.showForm = true;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  saveEvent(): void {

    if (!this.canManageEvents) {
      return;
    }

    if (this.editingId) {

      this.eventService.updateEvent(
        this.editingId,
        this.newEvent
      ).subscribe({

        next: (updatedEvent) => {
          this.events = this.events.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
          );

          this.cancelForm();
          alert('Event updated successfully!');
        },

        error: (error) => {
          console.error('Error updating event:', error);
          alert('Unable to update event.');
        }

      });

    } else {

      this.addEvent();

    }
  }

  deleteEvent(id: string): void {

    if (!this.canManageEvents) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this event?'
    );

    if (!confirmed) {
      return;
    }

    this.eventService.deleteEvent(id).subscribe({

      next: () => {
        this.events = this.events.filter(event => event.id !== id);

        if (this.editingId === id) {
          this.cancelForm();
        }

        alert('Event deleted successfully!');
      },

      error: (error) => {
        console.error('Error deleting event:', error);
        alert('Unable to delete event.');
      }

    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;

    this.newEvent = {
      title: '',
      category: '',
      date: '',
      location: '',
      description: ''
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
