import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = createClient(req, res);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { accountId, to, cc, bcc, subject, body, htmlBody } = req.body;

    if (!accountId || !to || !subject || !body) {
      return res.status(400).json({ error: 'Account ID, recipient, subject, and body are required' });
    }

    // Get email account
    const emailAccount = await prisma.emailAccount.findFirst({
      where: { 
        id: accountId,
        userId: user.id 
      }
    });

    if (!emailAccount) {
      return res.status(404).json({ error: 'Email account not found' });
    }

    // Create transporter based on provider
    let transporter;
    
    if (emailAccount.provider === 'gmail') {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailAccount.email,
          pass: emailAccount.password // App password
        }
      } as any);
    } else if (emailAccount.provider === 'outlook') {
      transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: emailAccount.email,
          pass: emailAccount.password
        }
      } as any);
    } else if (emailAccount.provider === 'imap' && emailAccount.smtpHost) {
      transporter = nodemailer.createTransport({
        host: emailAccount.smtpHost,
        port: emailAccount.smtpPort || 587,
        secure: emailAccount.smtpPort === 465,
        auth: {
          user: emailAccount.username || emailAccount.email,
          pass: emailAccount.password
        }
      } as any);
    } else {
      return res.status(400).json({ error: 'SMTP configuration not available for this account' });
    }

    // Send email
    const mailOptions = {
      from: emailAccount.email,
      to: Array.isArray(to) ? to.join(', ') : to,
      cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : undefined,
      subject,
      text: body,
      html: htmlBody
    };

    const info = await transporter.sendMail(mailOptions);

    // Store sent email in database
    const sentEmail = await prisma.email.create({
      data: {
        messageId: info.messageId || `sent-${Date.now()}`,
        subject,
        from: emailAccount.email,
        to: Array.isArray(to) ? to : [to],
        cc: cc ? (Array.isArray(cc) ? cc : [cc]) : [],
        bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : [],
        body,
        htmlBody,
        folder: 'SENT',
        isRead: true,
        receivedAt: new Date(),
        emailAccountId: emailAccount.id
      }
    });

    res.status(200).json({ 
      message: 'Email sent successfully',
      messageId: info.messageId,
      email: sentEmail
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}