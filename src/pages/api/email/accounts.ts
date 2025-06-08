import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient(req, res);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      // Get all email accounts for the user
      const emailAccounts = await prisma.emailAccount.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          email: true,
          provider: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { emails: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json(emailAccounts);
    } else if (req.method === 'POST') {
      // Add new email account
      const { 
        email, 
        provider, 
        accessToken, 
        refreshToken, 
        imapHost, 
        imapPort, 
        smtpHost, 
        smtpPort, 
        username, 
        password 
      } = req.body;

      if (!email || !provider) {
        return res.status(400).json({ error: 'Email and provider are required' });
      }

      // Check if email account already exists for this user
      const existingAccount = await prisma.emailAccount.findFirst({
        where: { 
          email,
          userId: user.id 
        }
      });

      if (existingAccount) {
        return res.status(400).json({ error: 'Email account already exists' });
      }

      const emailAccount = await prisma.emailAccount.create({
        data: {
          email,
          provider,
          accessToken,
          refreshToken,
          imapHost,
          imapPort,
          smtpHost,
          smtpPort,
          username,
          password, // Note: In production, this should be encrypted
          userId: user.id
        }
      });

      res.status(201).json({
        id: emailAccount.id,
        email: emailAccount.email,
        provider: emailAccount.provider,
        isActive: emailAccount.isActive,
        createdAt: emailAccount.createdAt
      });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Account ID is required' });
      }

      // Delete email account and all associated emails
      await prisma.emailAccount.delete({
        where: { 
          id,
          userId: user.id 
        }
      });

      res.status(200).json({ message: 'Email account deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Email accounts API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}