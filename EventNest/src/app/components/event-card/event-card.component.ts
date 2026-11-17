
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';
import { CommunityEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, DatePipe],

  template: `
    <article class="card">

      <div
        class="visual"
        [class.sports]="event.category === 'Sports'"
        [class.tech]="event.category === 'Technology'">

        <span>{{ categoryIcon }}</span>
        <small>{{ event.category }}</small>

      </div>

      <div class="body">

        <p class="date">
          {{ event.date | date:'EEE, d MMM yyyy' }}
        </p>

        <h3>{{ event.title }}</h3>

        <p class="description">
          {{ event.description }}
        </p>

        <div class="location">
          ⌖ {{ event.location }}
        </div>

        <div class="card-actions" *ngIf="canEdit">

          <button class="edit-btn" (click)="editEvent()">
            ✏️ Edit
          </button>

          <button class="delete-btn" (click)="deleteEvent()">
            🗑 Delete
          </button>

        </div>

      </div>

    </article>
  `,

  styles: [`
    .card {
      background: white;
      border: 1px solid #eaecf2;
      border-radius: 18px;
      overflow: hidden;
      transition: transform .2s, box-shadow .2s;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 14px 30px #24284c12;
    }

    .visual {
      height: 125px;
      background: linear-gradient(135deg,#e8e8ff,#c9caff);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #5556c9;
    }

    .visual span {
      font-size: 36px;
    }

    .visual small {
      font-weight: 750;
      margin-top: 4px;
    }

    .visual.sports {
      background: linear-gradient(135deg,#e3f6ed,#b7e7d0);
      color: #267c55;
    }

    .visual.tech {
      background: linear-gradient(135deg,#fff0dd,#ffd7a8);
      color: #a15d18;
    }

    .body {
      padding: 20px;
    }

    .date {
      color: #7779d8;
      font-size: 11px;
      font-weight: 800;
      margin: 0 0 9px;
    }

    h3 {
      font-size: 17px;
      line-height: 1.3;
      margin: 0 0 9px;
      color: #282c40;
    }

    .description {
      color: #7b8091;
      font-size: 13px;
      line-height: 1.5;
      min-height: 58px;
    }

    .location {
      color: #555b70;
      font-size: 12px;
      font-weight: 650;
      margin-top: 14px;
    }

    .card-actions {
      display: flex;
      gap: 10px;
      margin-top: 18px;
    }

    .card-actions button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
    }

    .edit-btn {
      background: #eeefff;
      color: #5556c9;
    }

    .edit-btn:hover {
      background: #dfe0ff;
    }

    .delete-btn {
      background: #fff0f0;
      color: #d13d4b;
    }

    .delete-btn:hover {
      background: #ffe0e0;
    }
  `]
})

export class EventCardComponent implements OnChanges {

  @Input() event!: CommunityEvent;

  @Input() canEdit = false;

  @Output() edit = new EventEmitter<CommunityEvent>();

  @Output() delete = new EventEmitter<string>();

  categoryIcon = '✦';

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['event'] && this.event) {

      this.categoryIcon =
        this.event.category === 'Sports' ? '⚽'
        : this.event.category === 'Technology' ? '⌘'
        : '✦';

    }

  }

  editEvent(): void {
    this.edit.emit(this.event);
  }

  deleteEvent(): void {
    if (this.event.id) {
      this.delete.emit(this.event.id);
    }
  }

}
