import 'server-only';

import * as jose from 'jose';
import * as nodeMailer from 'nodemailer';

const { JWT_ALGORITHM, JWT_SECRET } = process.env;
const { MAIL_USER, PASSWORD: MAIL_APP_PASSWORD } = process.env;
if (!JWT_ALGORITHM || !JWT_SECRET) {
  throw new Error('JWT configuration is missing in the environment variables.');
}
if (!MAIL_USER || !MAIL_APP_PASSWORD) {
  throw new Error(
    'Email configuration is missing in the environment variables.'
  );
}

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_APP_PASSWORD,
  },
});

export const sendToken = async ({
  email,
  token_subject,
  email_subject,
  mailBody,
}: {
  email: string;
  token_subject: string;
  email_subject: string;
  mailBody: {
    text: (token: string) => string;
    html: (token: string) => string;
  };
}) => {
  const token = await new jose.SignJWT({
    email,
    sub: token_subject,
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(JWT_SECRET));

  const mailOptions = {
    from: {
      name: 'Show Tracker',
      address: MAIL_USER,
    },
    to: [email],
    subject: email_subject,
    html: mailBody.html(token),
    text: mailBody.text(token),
  };

  const res = await transporter.sendMail(mailOptions);

  return res;
};
