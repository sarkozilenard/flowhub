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
        const todos = await prisma.todo.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(todos);

      case 'POST':
        const { title, description, priority, dueDate } = req.body;
        
        if (!title?.trim()) {
          return res.status(400).json({ error: 'Title is required' });
        }

        const newTodo = await prisma.todo.create({
          data: {
            title: title.trim(),
            description: description?.trim() || null,
            priority: priority || 'medium',
            dueDate: dueDate ? new Date(dueDate) : null,
            userId: user.id
          }
        });

        return res.status(201).json(newTodo);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in todos API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}