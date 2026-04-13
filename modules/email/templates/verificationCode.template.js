import { baseTemplate } from '#/modules/email/templates/base.template.js';

export function verificationCodeTemplate({ userName, verificationCode }) {
  const content = `
    <h1 style="color:#f9fafb;margin-bottom:16px;">
      Your Verification Code
    </h1>

    <p>Hi ${userName},</p>

    <p style="color:#9ca3af;">
      Use the code below to verify your identity. It is valid for <strong style="color:#e5e7eb;">10 minutes</strong>.
    </p>

    <div style="
      margin:28px 0;
      padding:20px;
      background:#1f2937;
      border:1px solid #374151;
      border-radius:10px;
      text-align:center;
    ">
      <span style="
        font-size:36px;
        font-weight:bold;
        letter-spacing:10px;
        color:#60a5fa;
      ">${verificationCode}</span>
    </div>

    <p style="color:#9ca3af;font-size:14px;">
      If you didn't request this code, you can safely ignore this email.
    </p>
  `;

  return baseTemplate({ content });
}
