import AppError from '#/errors/AppErrors.js';

export class BrandNotFoundError extends AppError {
  constructor() {
    super('Brand not found', 404);
  }
}

export class CarModelNotFoundError extends AppError {
  constructor() {
    super('Car model not found', 404);
  }
}
