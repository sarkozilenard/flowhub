import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';

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

    const { url, format = 'mp4', quality = 'highest' } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Basic YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Return development status message
    return res.status(503).json({
      error: 'YouTube Downloader - Under Development',
      message: 'The YouTube video downloader is currently under development due to recent changes in YouTube\'s API and anti-bot measures.',
      status: 'under_development',
      details: 'This feature is temporarily unavailable while we work on implementing a more robust solution.',
      alternatives: [
        'Use browser extensions like Video DownloadHelper',
        'Try online YouTube downloaders (yt1s.com, y2mate.com)',
        'Use desktop applications like yt-dlp or 4K Video Downloader',
        'Save videos to "Watch Later" playlist for offline viewing in YouTube app'
      ],
      eta: 'We are working on restoring this functionality. Please check back in future updates.'
    });
  } catch (error: any) {
    console.error('YouTube download error:', error);
    
    res.status(503).json({ 
      error: 'YouTube Downloader - Under Development',
      message: 'This feature is currently being rebuilt to comply with YouTube\'s latest policies and technical requirements.',
      status: 'under_development'
    });
  }
}