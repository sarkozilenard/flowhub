import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';
import QRCode from 'qrcode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supabase = createClient(req, res);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        const shortLinks = await prisma.shortLink.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(shortLinks);

      case 'POST':
        const { originalUrl, title, customCode } = req.body;
        
        if (!originalUrl?.trim()) {
          return res.status(400).json({ error: 'Original URL is required' });
        }

        // Validate URL format
        try {
          new URL(originalUrl);
        } catch {
          return res.status(400).json({ error: 'Invalid URL format' });
        }

        let shortCode = customCode?.trim();
        
        // If no custom code provided, generate random one
        if (!shortCode) {
          shortCode = Math.random().toString(36).substring(2, 8);
        } else {
          // Validate custom code format
          if (!/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
            return res.status(400).json({ error: 'Custom code can only contain letters, numbers, hyphens, and underscores' });
          }

          // Check if custom code already exists
          const existingLink = await prisma.shortLink.findUnique({
            where: { shortCode }
          });
          
          if (existingLink) {
            return res.status(400).json({ error: 'This custom code is already taken. Please choose another one.' });
          }
        }

        const newShortLink = await prisma.shortLink.create({
          data: {
            originalUrl: originalUrl.trim(),
            shortCode,
            title: title?.trim() || null,
            userId: user.id
          }
        });

        // Generate QR code for the short link
        const shortUrl = `${req.headers.origin || 'https://your-domain.com'}/s/${shortCode}`;
        try {
          const qrCodeData = await QRCode.toDataURL(shortUrl, {
            width: 200,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });

          // Save QR code to database
          await prisma.qRCode.create({
            data: {
              content: shortUrl,
              title: `QR Code for ${title || shortCode}`,
              foregroundColor: '#000000',
              backgroundColor: '#FFFFFF',
              size: 200,
              format: 'PNG',
              userId: user.id
            }
          });
        } catch (qrError) {
          console.error('QR code generation error:', qrError);
          // Don't fail the short link creation if QR code fails
        }

        return res.status(201).json({
          ...newShortLink,
          shortUrl
        });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in shortlinks API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}