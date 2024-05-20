'server only';

import prisma from '@/lib/prisma';
import * as jose from 'jose';
import * as nodeMailer from 'nodemailer';
import bcrypt from 'bcryptjs';

const { JWT_ALGORITHM, JWT_SECRET } = process.env;
if (!JWT_ALGORITHM || !JWT_SECRET) {
  throw new Error('JWT configuration is missing in the environment variables.');
}

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.PASSWORD,
  },
});

export const sendToken = async (email: string) => {
  const token = await new jose.SignJWT({
    email,
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(JWT_SECRET));

  const mailOptions = {
    from: {
      name: 'Show Tracker',
      address: process.env.MAIL_USER,
    },
    to: [email],
    subject: 'Register Email',
    text: `Complete your registration by clicking the link below: http://localhost:3000/singup?token=${token}`,
    html: `<p>
        Complete your registration by clicking the link below:
        <a href="http://localhost:3000/signup?token=${token}">Register</a> 
      </p>`,
  };

  const res = await transporter.sendMail(mailOptions);

  return res;
};
