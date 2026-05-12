import AppError from '#/errors/AppErrors.js';

export class MissingCarListingDataError extends AppError {
  constructor() {
    super('Missing car listing data.', 400);
  }
}

export class CarListingAlreadyExists extends AppError {
  constructor() {
    super('Car listing already exists.', 400);
  }
}

export class CarListingDoesntExists extends AppError {
  constructor() {
    super("Car listing doesnt't exist", 400);
  }
}
