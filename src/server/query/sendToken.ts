'server only';

import * as jose from 'jose';
import * as nodeMailer from 'nodemailer';

const { JWT_ALGORITHM, JWT_SECRET } = process.env;
const { MAIL_USER, PASSWORD } = process.env;
if (!JWT_ALGORITHM || !JWT_SECRET) {
  throw new Error('JWT configuration is missing in the environment variables.');
}
if (!MAIL_USER || !PASSWORD) {
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
    pass: PASSWORD,
  },
});

export const sendToken = async ({
  email,
  sub,
}: {
  email: string;
  sub: string;
}) => {
  const token = await new jose.SignJWT({
    email,
    sub,
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
