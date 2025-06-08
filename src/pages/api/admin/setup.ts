import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if any admin users already exist
    const existingAdmin = await prisma.user.findFirst({
      where: { isAdmin: true }
    });

    if (existingAdmin) {
      return res.status(400).json({ 
        error: 'Admin user already exists. Use the admin panel to manage users.' 
      });
    }

    const { email, username } = req.body;

    if (!email && !username) {
      return res.status(400).json({ 
        error: 'Either email or username is required' 
      });
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          username ? { username } : {}
        ].filter(condition => Object.keys(condition).length > 0)
      }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found. Please make sure the user has signed up first.' 
      });
    }

    // Promote user to admin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isAdmin: true }
    });

    return res.status(200).json({
      message: 'First admin user created successfully!',
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