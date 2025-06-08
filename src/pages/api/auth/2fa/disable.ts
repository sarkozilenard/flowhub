import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';
import speakeasy from 'speakeasy';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(req, res);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Get user's 2FA secret
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true }
    });

    if (!userProfile?.twoFactorSecret || !userProfile.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA not enabled' });
    }

    // Verify the token before disabling
    const verified = speakeasy.totp.verify({
      secret: userProfile.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // Disable 2FA and remove secret
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        twoFactorEnabled: false,
        twoFactorSecret: null
      }
    });

    res.status(200).json({ 
      success: true, 
      message: '2FA disabled successfully'
    });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}