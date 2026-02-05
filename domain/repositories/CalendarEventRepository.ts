import { CalendarEvent, CreateEventDTO, UpdateEventDTO } from '../entities/CalendarEvent';

export interface CalendarEventRepository {
  findById(id: string): Promise<CalendarEvent | null>;
  findByUserId(userId: string): Promise<CalendarEvent[]>;
  findPublic(): Promise<CalendarEvent[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]>;
  findAll(): Promise<CalendarEvent[]>;
  create(userId: string, eventData: CreateEventDTO): Promise<CalendarEvent>;
  update(id: string, eventData: UpdateEventDTO): Promise<CalendarEvent | null>;
  delete(id: string): Promise<boolean>;
}
