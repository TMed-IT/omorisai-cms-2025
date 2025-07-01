import { APIError } from 'payload'

export class EmailValidationError extends APIError {
  constructor(message: string) {
    super(message, 400, undefined, true)
  }
} 