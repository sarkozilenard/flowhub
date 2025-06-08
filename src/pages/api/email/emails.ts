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
      const { accountId, folder = 'INBOX', page = 1, limit = 50 } = req.query;

      if (!accountId) {
        return res.status(400).json({ error: 'Account ID is required' });
      }

      // Verify the email account belongs to the user
      const emailAccount = await prisma.emailAccount.findFirst({
        where: { 
          id: accountId as string,
          userId: user.id 
        }
      });

      if (!emailAccount) {
        return res.status(404).json({ error: 'Email account not found' });
      }

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const emails = await prisma.email.findMany({
        where: { 
          emailAccountId: accountId as string,
          folder: folder as string
        },
        orderBy: { receivedAt: 'desc' },
        skip,
        take: parseInt(limit as string),
        select: {
          id: true,
          messageId: true,
          subject: true,
          from: true,
          to: true,
          body: true,
          isRead: true,
          isStarred: true,
          folder: true,
          receivedAt: true,
          createdAt: true
        }
      });

      const totalCount = await prisma.email.count({
        where: { 
          emailAccountId: accountId as string,
          folder: folder as string
        }
      });

      res.status(200).json({
        emails,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit as string))
        }
      });
    } else if (req.method === 'PUT') {
      // Update email (mark as read/unread, star/unstar, move to folder)
      const { id, isRead, isStarred, folder } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Email ID is required' });
      }

      // Verify the email belongs to the user's account
      const email = await prisma.email.findFirst({
        where: { 
          id,
          emailAccount: {
            userId: user.id
          }
        }
      });

      if (!email) {
        return res.status(404).json({ error: 'Email not found' });
      }

      const updatedEmail = await prisma.email.update({
        where: { id },
        data: {
          ...(isRead !== undefined && { isRead }),
          ...(isStarred !== undefined && { isStarred }),
          ...(folder && { folder })
        }
      });

      res.status(200).json(updatedEmail);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Email ID is required' });
      }

      // Verify the email belongs to the user's account
      const email = await prisma.email.findFirst({
        where: { 
          id,
          emailAccount: {
            userId: user.id
          }
        }
      });

      if (!email) {
        return res.status(404).json({ error: 'Email not found' });
      }

      await prisma.email.delete({
        where: { id }
      });

      res.status(200).json({ message: 'Email deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Emails API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}