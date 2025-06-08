import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Find user with username "sarkozilenard"
    const user = await prisma.user.findFirst({
      where: { username: 'sarkozilenard' }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'User "sarkozilenard" not found. Please make sure this user has signed up first.' 
      });
    }

    if (user.isAdmin) {
      return res.status(200).json({ 
        message: 'User "sarkozilenard" is already an admin.',
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    }

    // Promote user to admin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isAdmin: true }
    });

    return res.status(200).json({
      message: 'User "sarkozilenard" has been successfully promoted to admin!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
      }
    });
  } catch (error: any) {
    console.error('Admin setup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}