export function baseTemplate({ content, title = 'Car Stock Market' }) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body style="margin:0;padding:0;font-family:Arial, sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            
            <!-- Main container -->
            <table width="600" cellpadding="0" cellspacing="0" style="
              background:#111827;
              border-radius:12px;
              padding:32px;
              color:#e5e7eb;
            ">
              
              <!-- Header -->
              <tr>
                <td style="padding-bottom:24px;">
                  <h2 style="margin:0;color:#60a5fa;">
                    🚗 ${title}
                  </h2>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="font-size:16px;line-height:1.6;">
                  ${content}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding-top:32px;font-size:12px;color:#9ca3af;">
                  © ${new Date().getFullYear()} Car Stock Market
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
}
