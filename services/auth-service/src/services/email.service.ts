// ═══════════════════════════════════════════════════════════════
// Auth Microservice — Gmail SMTP & Resend Email Delivery Engine
// Direct delivery to any recipient inbox via Google SMTP
// ═══════════════════════════════════════════════════════════════

import nodemailer, { type Transporter } from 'nodemailer';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailService {
  private transporter: Transporter | null = null;
  private smtpFrom: string;
  private resendApiKey: string;
  private resendFrom: string;

  constructor() {
    const user = process.env.SMTP_USER || '';
    const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
    this.smtpFrom = process.env.EMAIL_FROM || (user ? `"Rennetus" <${user}>` : '');
    this.resendApiKey = process.env.RESEND_API_KEY || '';
    this.resendFrom = process.env.RESEND_FROM_EMAIL || 'Rennetus <onboarding@resend.dev>';

    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass,
        },
      });
    } catch (err: any) {
      console.warn('[EmailService] Failed to initialize nodemailer transporter:', err.message);
    }
  }

  /**
   * Primary dispatcher: Attempts Gmail SMTP first, falls back to Resend API
   */
  private async dispatchEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<EmailSendResult> {
    const plainText = text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    // 1. Try Gmail SMTP (Delivers directly to any recipient without domain requirements)
    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: this.smtpFrom,
          to,
          replyTo: 'rennetusofficial@gmail.com',
          subject,
          text: plainText,
          html,
          headers: {
            'X-Mailer': 'Rennetus-Auth-Service',
            'X-Priority': '1',
            'X-MSMail-Priority': 'High',
            'Importance': 'High',
          },
        });

        console.log(`[EmailService] ✅ Email delivered via Gmail SMTP to ${to}. Message ID: ${info.messageId}`);
        return {
          success: true,
          messageId: info.messageId,
        };
      } catch (err: any) {
        console.warn(`[EmailService] ⚠️ Gmail SMTP delivery attempt failed for ${to}:`, err.message);
      }
    }

    // 2. Fallback to Resend API if SMTP encounters an issue
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.resendFrom,
          to: [to],
          reply_to: 'rennetusofficial@gmail.com',
          subject,
          text: plainText,
          html,
        }),
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        console.warn(`[EmailService] Resend Fallback Notice (${response.status}):`, data.message || data);
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
        };
      }

      console.log(`[EmailService] Delivered via Resend fallback to ${to}. ID: ${data.id}`);
      return {
        success: true,
        messageId: data.id,
      };
    } catch (err: any) {
      console.warn(`[EmailService] Network dispatch failed:`, err.message);
      return {
        success: false,
        error: err.message,
      };
    }
  }

  /**
   * Send 6-Digit Registration Verification OTP
   */
  async sendRegistrationOtp(toEmail: string, name: string, otp: string): Promise<EmailSendResult> {
    const subject = `Your Rennetus verification code: ${otp}`;
    const displayName = name?.trim() || 'Candidate';

    const plainText = [
      `Rennetus — AI Interview Calibration & Readiness Platform`,
      ``,
      `Hello ${displayName},`,
      ``,
      `Your 6-digit email verification code is: ${otp}`,
      ``,
      `This code expires in 10 minutes. Please enter it in your browser window to verify your account and proceed to role calibration.`,
      ``,
      `Security Note: Never share this code with anyone. Rennetus team members will never ask for your verification code. If you did not create an account, you can safely ignore this email.`,
      ``,
      `© ${new Date().getFullYear()} Rennetus AI Inc. All rights reserved.`,
    ].join('\n');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <!-- Hidden Preheader text -->
        <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
          Your 6-digit Rennetus verification code is ${otp}. Valid for 10 minutes.
        </div>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 48px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 24px rgba(17, 24, 61, 0.06); border: 1px solid #e2e8f0; overflow: hidden;" cellspacing="0" cellpadding="0">
                
                <!-- Brand Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #11183D 0%, #1e293b 50%, #2459A8 100%); padding: 36px 32px 30px; text-align: center;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.12); padding: 6px 14px; border-radius: 100px; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">
                            <span style="color: #93c5fd; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;">Identity Verification</span>
                          </div>
                          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Rennetus</h1>
                          <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 13px; font-weight: 400;">AI Interview Calibration & Readiness Platform</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px 28px;">
                    <p style="color: #0f172a; font-size: 17px; font-weight: 700; margin: 0 0 10px 0;">Hello ${displayName},</p>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                      Thank you for joining Rennetus. To verify your email address and continue your setup, please enter the following 6-digit confirmation code:
                    </p>

                    <!-- OTP Code Card -->
                    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 16px; padding: 26px 20px; text-align: center; margin: 0 0 24px 0;">
                      <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #11183D; margin: 0; padding-left: 10px;">
                        ${otp}
                      </div>
                      <p style="color: #64748b; font-size: 12px; margin: 12px 0 0 0; font-weight: 600;">
                        ⏱️ Expires in <strong>10 minutes</strong>
                      </p>
                    </div>

                    <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0 0 20px 0;">
                      Enter this code in your registration tab to immediately unlock your target track and calibration preferences.
                    </p>

                    <div style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
                      <p style="color: #94a3b8; font-size: 11.5px; line-height: 1.5; margin: 0;">
                        <strong>Security Tip:</strong> Never share this verification code with anyone. Rennetus leads will never ask for your code. If you did not sign up, you can safely disregard this message.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
                      © ${new Date().getFullYear()} Rennetus AI Inc. All rights reserved.<br>
                      Sent by Rennetus Security Operations • rennetusofficial@gmail.com
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Console broadcast for fast local developer debugging
    console.log(`\n════════════════════════════════════════════════════════════`);
    console.log(`[Rennetus Auth] OTP Verification Code for: ${toEmail}`);
    console.log(`🔑 6-Digit OTP: ${otp} (Expires in 10 mins)`);
    console.log(`════════════════════════════════════════════════════════════\n`);

    return this.dispatchEmail(toEmail, subject, html, plainText);
  }

  /**
   * Send Password Reset Link Email
   */
  async sendPasswordResetEmail(toEmail: string, resetUrl: string): Promise<EmailSendResult> {
    const subject = `Reset Your Rennetus Password`;

    const plainText = [
      `Rennetus — Password Reset`,
      ``,
      `Hello,`,
      ``,
      `We received a request to reset the password for your Rennetus account (${toEmail}).`,
      ``,
      `To choose a new password, click the link below or copy and paste it into your browser:`,
      `${resetUrl}`,
      ``,
      `This link is valid for 1 hour. If you did not request this password reset, please ignore this email. Your password will remain unchanged.`,
      ``,
      `© ${new Date().getFullYear()} Rennetus AI Inc. All rights reserved.`,
    ].join('\n');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <!-- Preheader -->
        <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
          Follow the link inside to reset your password on Rennetus. Valid for 1 hour.
        </div>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 48px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 24px rgba(17, 24, 61, 0.06); border: 1px solid #e2e8f0; overflow: hidden;" cellspacing="0" cellpadding="0">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #11183D 0%, #1e293b 50%, #2459A8 100%); padding: 36px 32px 30px; text-align: center;">
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.12); padding: 6px 14px; border-radius: 100px; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">
                      <span style="color: #93c5fd; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;">Security Center</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Rennetus</h1>
                    <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 13px; font-weight: 400;">Password Security Request</p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px 28px;">
                    <p style="color: #0f172a; font-size: 17px; font-weight: 700; margin: 0 0 10px 0;">Password Reset Request</p>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                      We received a request to reset the password associated with <strong style="color: #0f172a;">${toEmail}</strong>. Click the button below to set a new password:
                    </p>

                    <!-- Reset Action Button -->
                    <div style="text-align: center; margin: 28px 0;">
                      <a href="${resetUrl}" style="background-color: #2459A8; color: #ffffff; text-decoration: none; padding: 14px 34px; border-radius: 12px; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 14px rgba(36, 89, 168, 0.3);">
                        Reset My Password →
                      </a>
                    </div>

                    <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0 0 10px 0;">
                      This link expires in <strong>1 hour</strong>. If the button above does not open, copy and paste this link into your browser:
                    </p>
                    <p style="color: #2459A8; font-size: 11px; word-break: break-all; margin: 0 0 24px 0;">
                      <a href="${resetUrl}" style="color: #2459A8; text-decoration: underline;">${resetUrl}</a>
                    </p>

                    <div style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
                      <p style="color: #94a3b8; font-size: 11.5px; line-height: 1.5; margin: 0;">
                        If you did not request this password reset, you can safely ignore this email. Your current password remains secure.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
                      © ${new Date().getFullYear()} Rennetus AI Inc. All rights reserved.<br>
                      Sent by Rennetus Security Operations • rennetusofficial@gmail.com
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    console.log(`\n════════════════════════════════════════════════════════════`);
    console.log(`[Rennetus Auth] Password Reset Link for: ${toEmail}`);
    console.log(`🔗 Link: ${resetUrl}`);
    console.log(`════════════════════════════════════════════════════════════\n`);

    return this.dispatchEmail(toEmail, subject, html, plainText);
  }
}

export const emailService = new EmailService();
