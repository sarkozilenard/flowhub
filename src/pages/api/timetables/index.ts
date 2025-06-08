import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient(req, res);
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      try {
        const timetables = await prisma.timetable.findMany({
          where: {
            userId: user.id
          },
          orderBy: {
            uploadedAt: 'desc'
          }
        });

        res.status(200).json(timetables);
      } catch (error) {
        console.error('Error fetching timetables:', error);
        res.status(500).json({ error: 'Failed to fetch timetables' });
      }
    } else if (req.method === 'POST') {
      try {
        const { title, description, fileName, fileUrl, fileSize, fileType } = req.body;

        if (!title || !fileName || !fileUrl || !fileSize || !fileType) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const timetable = await prisma.timetable.create({
          data: {
            title,
            description: description || null,
            fileName,
            fileUrl,
            fileSize,
            fileType,
            userId: user.id
          }
        });

        res.status(201).json(timetable);
      } catch (error) {
        console.error('Error creating timetable:', error);
        res.status(500).json({ error: 'Failed to create timetable' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Timetable API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}