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

    const { token, enable } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Get user's 2FA secret
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true }
    });

    if (!userProfile?.twoFactorSecret) {
      return res.status(400).json({ error: '2FA not set up' });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: userProfile.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow some time drift
    });

    if (!verified) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // If enabling 2FA, update the user record
    if (enable) {
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorEnabled: true }
      });
    }

    res.status(200).json({ 
      success: true, 
      message: enable ? '2FA enabled successfully' : 'Token verified'
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}