import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient(req, res);
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid timetable ID' });
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      try {
        const timetable = await prisma.timetable.findFirst({
          where: {
            id,
            userId: user.id
          }
        });

        if (!timetable) {
          return res.status(404).json({ error: 'Timetable not found' });
        }

        res.status(200).json(timetable);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        res.status(500).json({ error: 'Failed to fetch timetable' });
      }
    } else if (req.method === 'PUT') {
      try {
        const { title, description } = req.body;

        if (!title) {
          return res.status(400).json({ error: 'Title is required' });
        }

        const timetable = await prisma.timetable.updateMany({
          where: {
            id,
            userId: user.id
          },
          data: {
            title,
            description: description || null,
            updatedAt: new Date()
          }
        });

        if (timetable.count === 0) {
          return res.status(404).json({ error: 'Timetable not found' });
        }

        const updatedTimetable = await prisma.timetable.findFirst({
          where: {
            id,
            userId: user.id
          }
        });

        res.status(200).json(updatedTimetable);
      } catch (error) {
        console.error('Error updating timetable:', error);
        res.status(500).json({ error: 'Failed to update timetable' });
      }
    } else if (req.method === 'DELETE') {
      try {
        const timetable = await prisma.timetable.deleteMany({
          where: {
            id,
            userId: user.id
          }
        });

        if (timetable.count === 0) {
          return res.status(404).json({ error: 'Timetable not found' });
        }

        res.status(200).json({ message: 'Timetable deleted successfully' });
      } catch (error) {
        console.error('Error deleting timetable:', error);
        res.status(500).json({ error: 'Failed to delete timetable' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Timetable API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}