export type EventType = 'session' | 'reminder' | 'milestone' | 'other';
export type EventVisibility = 'private' | 'public';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  endDate?: Date;
  type: EventType;
  createdBy: string;
  visibility: EventVisibility;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventDTO {
  title: string;
  description?: string;
  date: Date | string;
  endDate?: Date | string;
  type?: EventType;
  visibility?: EventVisibility;
  color?: string;
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  date?: Date | string;
  endDate?: Date | string;
  type?: EventType;
  visibility?: EventVisibility;
  color?: string;
}
