import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';

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
    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({ error: 'Account ID is required' });
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

    // For now, return a development message since full IMAP implementation requires additional setup
    res.status(200).json({ 
      message: 'Email sync initiated',
      status: 'development',
      note: 'Full IMAP email synchronization is currently under development. This feature requires additional server configuration and IMAP client implementation.',
      account: {
        email: emailAccount.email,
        provider: emailAccount.provider,
        isActive: emailAccount.isActive
      }
    });
  } catch (error) {
    console.error('Email sync error:', error);
    res.status(500).json({ error: 'Failed to sync emails' });
  }
}