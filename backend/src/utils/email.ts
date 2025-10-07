import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

export const sendEmail = async (to: string, subject: string, text: string) => {
  // Using Ethereal to test
  if (!transporter) {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }

  const info = await transporter.sendMail({
    from: '"Jia Weis Application Tracker" <no-reply@jobtracker.com>',
    to,
    subject,
    text,
  });

  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
};