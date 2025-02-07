import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST as string,
  port: parseInt(process.env.SMTP_PORT as string),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASSWORD as string
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email verification service
export function generateVerificationToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

export async function sendVerificationEmail(email: string, token: string, id: string) {
  const verificationLink = `${process.env.FRONTEND_ORIGIN}/verify-email?token=${encodeURIComponent(token)}&id=${encodeURIComponent(id)}`;
  
  const mailOptions = {
    from: emailConfig.auth.user,
    to: email,
    subject: 'Vault Venture - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Vault Venture!</h1>
        <div style="margin: 20px 0;">
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        </div>
        <div style="margin: 20px 0;">
          <p>If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationLink}</p>
        </div>
        <div>
          <p style="color: #666; font-size: 0.9em;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function sendPasswordEmail(name: string, email: string, password: string) {  
  const mailOptions = {
    from: emailConfig.auth.user,
    to: email,
    subject: 'Welcome to Vault Venture - Your Login Credentials',
    html: `
      <div data-smartmail="gmail_signature" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Vault Venture!</h1>
        
        <p>Hey ${name}! Vault Venture is a special game from E</p>
        <p>Your account has been pre-registered for you. Here are your login credentials:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        
        <a href="${process.env.FRONTEND_ORIGIN}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0;">Check it out</a>
        
        <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
          <p style="color: #666;">If you have any questions or need assistance, contact .</p>
          <p style="color: #666;">Welcome aboard!</p>
        </div>
      </div>
    `
  };
  //TODO: Content finalization pending

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password email:', error);
    throw new Error('Failed to send password email');
  }
}