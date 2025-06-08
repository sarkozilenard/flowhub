import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';
import QRCode from 'qrcode';

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

    const { 
      content, 
      title, 
      foregroundColor = '#000000', 
      backgroundColor = '#FFFFFF',
      size = 200,
      format = 'PNG'
    } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Generate QR code
    const qrCodeOptions = {
      width: size,
      color: {
        dark: foregroundColor,
        light: backgroundColor
      }
    };

    let qrCodeData;
    if (format.toLowerCase() === 'svg') {
      qrCodeData = await QRCode.toString(content, { 
        ...qrCodeOptions, 
        type: 'svg' 
      });
    } else {
      qrCodeData = await QRCode.toDataURL(content, qrCodeOptions);
    }

    // Save to database
    const qrCode = await prisma.qRCode.create({
      data: {
        content,
        title,
        foregroundColor,
        backgroundColor,
        size,
        format: format.toUpperCase(),
        userId: user.id
      }
    });

    res.status(200).json({
      ...qrCode,
      qrCodeData,
      format: format.toLowerCase()
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}