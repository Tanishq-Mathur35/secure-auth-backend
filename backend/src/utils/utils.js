export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


export function getOtpHtml(otp) {
    return `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
        <tr>
        <td align="center">

            <!-- Main Card -->
            <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- Hero Image -->
            <tr>
                <td>
                <img 
                    src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop" 
                    alt="Verification" 
                    width="100%" 
                    style="display:block; border:0;"
                />
                </td>
            </tr>

            <!-- Content -->
            <tr>
                <td style="padding:30px; text-align:center;">

                <h2 style="margin:0; color:#111827;">Verify Your Email</h2>

                <p style="color:#6b7280; font-size:14px; margin-top:10px;">
                    Enter the following OTP to continue
                </p>

                <!-- OTP Box -->
                <div style="margin:30px 0;">
                    <span style="
                    display:inline-block;
                    padding:16px 28px;
                    font-size:30px;
                    font-weight:bold;
                    letter-spacing:6px;
                    color:#ffffff;
                    background:#111827;
                    border-radius:8px;
                    ">
                    ${otp}
                    </span>
                </div>

                <p style="font-size:13px; color:#6b7280;">
                    This code expires in <strong>5 minutes</strong>.
                </p>

                <p style="font-size:12px; color:#9ca3af; margin-top:20px;">
                    If you didn’t request this, you can ignore this email.
                </p>

                </td>
            </tr>

            <!-- Divider -->
            <tr>
                <td style="padding:0 30px;">
                <hr style="border:none; border-top:1px solid #e5e7eb;" />
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding:20px; text-align:center;">
                <p style="margin:0; font-size:12px; color:#9ca3af;">
                    Secure authentication • ${new Date().getFullYear()}
                </p>
                </td>
            </tr>

            </table>

        </td>
        </tr>
    </table>

    </body>
</html>`;
}