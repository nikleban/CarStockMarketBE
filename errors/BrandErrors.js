import AppError from "#/errors/AppErrors.js";

export class BrandNotFoundError extends AppError {
  constructor() {
    super("Brand not found", 404);
  }
}
