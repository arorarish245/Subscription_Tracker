import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from './env.js';

export const accountEmail = 'naitra542@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "naitra542@gmail.com",
    pass: EMAIL_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('❌ Transporter connection error:', error);
  }
});

export default transporter;
