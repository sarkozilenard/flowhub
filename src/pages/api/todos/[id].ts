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
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    switch (req.method) {
      case 'PUT':
        const { title, description, completed, priority, dueDate } = req.body;
        
        const updatedTodo = await prisma.todo.update({
          where: { 
            id: id,
            userId: user.id // Ensure user can only update their own todos
          },
          data: {
            ...(title !== undefined && { title: title.trim() }),
            ...(description !== undefined && { description: description?.trim() || null }),
            ...(completed !== undefined && { completed }),
            ...(priority !== undefined && { priority }),
            ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
          }
        });

        return res.status(200).json(updatedTodo);

      case 'DELETE':
        await prisma.todo.delete({
          where: { 
            id: id,
            userId: user.id // Ensure user can only delete their own todos
          }
        });

        return res.status(200).json({ message: 'Todo deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in todo API:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}