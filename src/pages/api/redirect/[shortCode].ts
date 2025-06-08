import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { shortCode } = req.query;

  if (!shortCode || typeof shortCode !== 'string') {
    return res.status(400).json({ message: 'Invalid short code' });
  }

  try {
    const supabase = createClient();

    // Find the short link
    const { data: shortLink, error } = await supabase
      .from('ShortLink')
      .select('originalUrl, clicks')
      .eq('shortCode', shortCode)
      .single();

    if (error || !shortLink) {
      return res.status(404).json({ message: 'Short link not found' });
    }

    // Increment click count
    await supabase
      .from('ShortLink')
      .update({ clicks: shortLink.clicks + 1 })
      .eq('shortCode', shortCode);

    // Redirect to original URL
    return res.redirect(302, shortLink.originalUrl);
  } catch (error) {
    console.error('Error redirecting short link:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}