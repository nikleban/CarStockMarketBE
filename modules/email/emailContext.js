class BaseEmailContext {
  constructor(context) {
    this.context = context;
  }
}

export class LoginEmailContext extends BaseEmailContext {
  constructor({ userName, loginPageLink }) {
    super({
      userName,
      loginPageLink,
    });
  }
}

export class VerificationCodeContext extends BaseEmailContext {
  constructor({ userName, verificationCode }) {
    super({
      userName,
      verificationCode,
    });
  }
}
