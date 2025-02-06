import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email configuration
const emailConfig = {
  host: 'smtp.example.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email verification service
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function sendVerificationEmail(email: string, token: string, id: string) {
  const verificationLink = `${process.env.SERVER_HOST}/verify-email?token=${token}?id=${id}`;
  
  const mailOptions = {
    from: emailConfig.auth.user,
    to: email,
    subject: 'Vault Venture - Verify Your Email',
    html: `
      <h1>Welcome to Your Vault Venture!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}