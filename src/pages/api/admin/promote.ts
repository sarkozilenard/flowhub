import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';

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

    // Get current user's profile to check if they're admin
    const currentUserProfile = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!currentUserProfile?.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { userId, isAdmin } = req.body;

    if (!userId || typeof isAdmin !== 'boolean') {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Update user admin status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin }
    });

    return res.status(200).json({
      message: `User ${isAdmin ? 'promoted to' : 'removed from'} admin successfully`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
      }
    });
  } catch (error: any) {
    console.error('Admin promotion error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}