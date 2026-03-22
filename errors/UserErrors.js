import AppError from "#/errors/AppErrors.js";

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

export class UserDoesntExist extends AppError {
  constructor() {
    super(`User doesnt exist`, 409);
  }
}