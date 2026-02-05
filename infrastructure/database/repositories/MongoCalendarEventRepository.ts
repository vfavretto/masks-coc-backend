import { CalendarEventRepository } from '../../../domain/repositories/CalendarEventRepository';
import { CalendarEvent, CreateEventDTO, UpdateEventDTO } from '../../../domain/entities/CalendarEvent';
import { CalendarEventModel, CalendarEventDocument } from '../models/CalendarEventModel';

const toEvent = (doc: CalendarEventDocument): CalendarEvent => ({
  id: (doc._id as any).toString(),
  title: doc.title,
  description: doc.description,
  date: doc.date,
  endDate: doc.endDate,
  type: doc.type,
  createdBy: doc.createdBy.toString(),
  visibility: doc.visibility,
  color: doc.color,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export class MongoCalendarEventRepository implements CalendarEventRepository {
  async findById(id: string): Promise<CalendarEvent | null> {
    const doc = await CalendarEventModel.findById(id);
    return doc ? toEvent(doc) : null;
  }

  async findByUserId(userId: string): Promise<CalendarEvent[]> {
    const docs = await CalendarEventModel.find({ createdBy: userId }).sort({ date: 1 });
    return docs.map(toEvent);
  }

  async findPublic(): Promise<CalendarEvent[]> {
    const docs = await CalendarEventModel.find({ visibility: 'public' }).sort({ date: 1 });
    return docs.map(toEvent);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const docs = await CalendarEventModel.find({
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });
    return docs.map(toEvent);
  }

  async findAll(): Promise<CalendarEvent[]> {
    const docs = await CalendarEventModel.find().sort({ date: 1 });
    return docs.map(toEvent);
  }

  async create(userId: string, eventData: CreateEventDTO): Promise<CalendarEvent> {
    const doc = await CalendarEventModel.create({
      ...eventData,
      createdBy: userId,
      type: eventData.type || 'other',
      visibility: eventData.visibility || 'public',
    });
    return toEvent(doc);
  }

  async update(id: string, eventData: UpdateEventDTO): Promise<CalendarEvent | null> {
    const doc = await CalendarEventModel.findByIdAndUpdate(id, eventData, { new: true });
    return doc ? toEvent(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CalendarEventModel.findByIdAndDelete(id);
    return !!result;
  }
}
