'use server';

import prisma from '@/lib/prisma';
import * as jose from 'jose';
import * as nodeMailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { sendToken } from '../query/sendToken';

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

export const registerEmail = async (email: string) => {
  try {
    const res = sendToken(email);
    console.log('Email sent: ', res);
  } catch (e) {
    console.error(e);
    throw new Error('Failed to generate token');
  }
};

export const signUp = async ({
  token,
  name,
  password,
}: {
  token: string;
  name: string;
  password: string;
}) => {
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const { email } = payload;

    if (!email || typeof email !== 'string' || !name || !password) {
      throw new Error('Invalid token');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        name,
      },
      select: {
        email: true,
        name: true,
      },
    });
    console.log('User created: ', user);
    return user;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to register');
  }
};
