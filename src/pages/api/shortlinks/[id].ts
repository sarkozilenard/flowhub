import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supabase = createClient(req, res);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid link ID' });
    }

    switch (req.method) {
      case 'DELETE':
        // Check if the link exists and belongs to the user
        const existingLink = await prisma.shortLink.findUnique({
          where: { id },
          select: { userId: true }
        });

        if (!existingLink) {
          return res.status(404).json({ error: 'Link not found' });
        }

        if (existingLink.userId !== user.id) {
          return res.status(403).json({ error: 'You can only delete your own links' });
        }

        // Delete the link
        await prisma.shortLink.delete({
          where: { id }
        });

        return res.status(200).json({ message: 'Link deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in shortlinks/[id] API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}