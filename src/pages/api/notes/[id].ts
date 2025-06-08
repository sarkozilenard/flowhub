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
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    switch (req.method) {
      case 'PUT':
        const { title, content, tags } = req.body;
        
        const tagArray = Array.isArray(tags) ? tags : 
          (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []);

        const updatedNote = await prisma.note.update({
          where: { 
            id: id,
            userId: user.id // Ensure user can only update their own notes
          },
          data: {
            ...(title !== undefined && { title: title.trim() }),
            ...(content !== undefined && { content: content.trim() }),
            ...(tags !== undefined && { tags: tagArray }),
          }
        });

        return res.status(200).json(updatedNote);

      case 'DELETE':
        await prisma.note.delete({
          where: { 
            id: id,
            userId: user.id // Ensure user can only delete their own notes
          }
        });

        return res.status(200).json({ message: 'Note deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Error in note API:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}