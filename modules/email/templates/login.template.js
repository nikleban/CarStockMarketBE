import { baseTemplate } from '#/modules/email/templates/base.template.js';

export function loginTemplate({ userName, loginPageLink }) {
  const content = `
    <h1 style="color:#f9fafb;margin-bottom:16px;">
      New login detected
    </h1>

    <p>
      Hi ${userName},
    </p>

    <p>
      We noticed a new login to your account.
    </p>

    <p>
      If this was you, you can safely ignore this email.
    </p>

    <p>
      If this wasn't you, secure your account immediately:
    </p>

    <div style="margin:24px 0;">
      <a href="${loginPageLink}" style="
        display:inline-block;
        background:#3b82f6;
        color:#ffffff;
        padding:12px 20px;
        border-radius:8px;
        text-decoration:none;
        font-weight:bold;
      ">
        Secure my account
      </a>
    </div>

    <p style="color:#9ca3af;font-size:14px;">
      If the button doesn't work, copy and paste this URL:<br/>
      ${loginPageLink}
    </p>
  `;

  return baseTemplate({ content });
}
