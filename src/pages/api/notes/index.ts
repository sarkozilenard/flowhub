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

    switch (req.method) {
      case 'GET':
        const notes = await prisma.note.findMany({
          where: { userId: user.id },
          orderBy: { updatedAt: 'desc' }
        });
        return res.status(200).json(notes);

      case 'POST':
        const { title, content, tags } = req.body;
        
        if (!title?.trim() || !content?.trim()) {
          return res.status(400).json({ error: 'Title and content are required' });
        }

        const tagArray = Array.isArray(tags) ? tags : 
          (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []);

        const newNote = await prisma.note.create({
          data: {
            title: title.trim(),
            content: content.trim(),
            tags: tagArray,
            userId: user.id
          }
        });

        return res.status(201).json(newNote);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in notes API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}