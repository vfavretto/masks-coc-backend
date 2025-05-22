import { ApplicationError } from './ApplicationError';

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 400);
  }
}