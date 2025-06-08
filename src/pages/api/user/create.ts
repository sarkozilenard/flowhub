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

    const { id, email, username, name, profilePicture } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    // Check if username is already taken
    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUsername) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        username: username || null,
        name: name || null,
        profilePicture: profilePicture || null,
        isAdmin: false,
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}