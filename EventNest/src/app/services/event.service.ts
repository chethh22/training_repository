
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CommunityEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:3000/events';

  constructor(private http: HttpClient) {}

  // GET: Fetch all events
  getEvents(): Observable<CommunityEvent[]> {
    return this.http.get<CommunityEvent[]>(this.apiUrl);
  }

  // POST: Add a new event
  addEvent(event: CommunityEvent): Observable<CommunityEvent> {
    return this.http.post<CommunityEvent>(this.apiUrl, event);
  }

  // PUT: Update an existing event
  updateEvent(
    id: string,
    event: CommunityEvent
  ): Observable<CommunityEvent> {
    return this.http.put<CommunityEvent>(
      `${this.apiUrl}/${id}`,
      event
    );
  }

  // DELETE: Remove an event
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
