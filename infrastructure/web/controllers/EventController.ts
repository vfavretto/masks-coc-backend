import { Request, Response } from 'express';
import { MongoCalendarEventRepository } from '../../database/repositories/MongoCalendarEventRepository';

const eventRepository = new MongoCalendarEventRepository();

export class EventController {
  static async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      const { mine } = req.query;

      if (mine === 'true' && req.user) {
        const events = await eventRepository.findByUserId(req.user.userId);
        res.json(events);
        return;
      }

      // Get public events + user's private events
      const publicEvents = await eventRepository.findPublic();
      
      if (req.user) {
        const userEvents = await eventRepository.findByUserId(req.user.userId);
        const privateUserEvents = userEvents.filter(e => e.visibility === 'private');
        const allEvents = [...publicEvents, ...privateUserEvents];
        // Sort by date
        allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        res.json(allEvents);
        return;
      }

      res.json(publicEvents);
    } catch (error) {
      console.error('Get events error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await eventRepository.findById(id);

      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      // Check access
      if (event.visibility === 'private' && event.createdBy !== req.user?.userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      res.json(event);
    } catch (error) {
      console.error('Get event error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createEvent(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { title, description, date, endDate, type, visibility, color } = req.body;

      if (!title || !date) {
        res.status(400).json({ error: 'Title and date are required' });
        return;
      }

      const event = await eventRepository.create(req.user.userId, {
        title,
        description,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : undefined,
        type,
        visibility,
        color,
      });

      res.status(201).json(event);
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const existingEvent = await eventRepository.findById(id);

      if (!existingEvent) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      // Only creator or keeper can update
      if (existingEvent.createdBy !== req.user.userId && req.user.role !== 'keeper') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const updateData = { ...req.body };
      if (updateData.date) updateData.date = new Date(updateData.date);
      if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

      const event = await eventRepository.update(id, updateData);
      res.json(event);
    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const existingEvent = await eventRepository.findById(id);

      if (!existingEvent) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      // Only creator or keeper can delete
      if (existingEvent.createdBy !== req.user.userId && req.user.role !== 'keeper') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      await eventRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
