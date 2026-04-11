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
