import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient(req, res);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      // Get all QR codes for the user
      const qrCodes = await prisma.qRCode.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json(qrCodes);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'QR code ID is required' });
      }

      // Delete QR code (ensure it belongs to the user)
      await prisma.qRCode.delete({
        where: { 
          id,
          userId: user.id 
        }
      });

      res.status(200).json({ message: 'QR code deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('QR codes API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}