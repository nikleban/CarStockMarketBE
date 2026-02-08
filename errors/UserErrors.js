import AppError from "./AppErrors.js";

export class MissingUserDataError extends AppError {
  constructor() {
    super("Missing user data", 400);
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor(email) {
    super(`User with email ${email} already exists`, 409);
  }
}
