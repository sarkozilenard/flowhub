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

    // Extract video ID from URL
    let videoId = '';
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid YouTube URL format' });
    }

    if (!videoId) {
      return res.status(400).json({ error: 'Could not extract video ID from URL' });
    }

    // Check if it's a playlist
    const isPlaylist = url.includes('playlist?list=') || url.includes('&list=');

    if (isPlaylist) {
      // For now, return a message that playlist support is limited
      return res.status(200).json({
        type: 'playlist',
        title: 'Playlist Detected',
        message: 'Playlist downloading is currently limited due to API restrictions. Please try individual video URLs.',
        videoCount: 0,
        videos: [],
        downloadUrl: null,
        format,
        quality
      });
    } else {
      // For individual videos, provide information but note limitations
      return res.status(200).json({
        type: 'video',
        title: 'Video Processing',
        message: 'YouTube video downloading is currently experiencing issues due to API changes and restrictions. This feature is temporarily limited.',
        videoId: videoId,
        originalUrl: url,
        format,
        quality,
        downloadUrl: null,
        status: 'limited',
        alternatives: [
          'Use browser extensions for downloading',
          'Try online YouTube downloaders',
          'Use desktop applications like yt-dlp'
        ]
      });
    }
  } catch (error: any) {
    console.error('YouTube download error:', error);
    
    // Provide more specific error messages
    if (error?.statusCode === 410) {
      return res.status(410).json({ 
        error: 'Video is no longer available or has been removed',
        details: 'The video may have been deleted, made private, or restricted in your region.'
      });
    } else if (error?.statusCode === 403) {
      return res.status(403).json({ 
        error: 'Access forbidden',
        details: 'The video may be age-restricted, private, or blocked in your region.'
      });
    } else if (error?.statusCode === 404) {
      return res.status(404).json({ 
        error: 'Video not found',
        details: 'The video ID is invalid or the video has been removed.'
      });
    }
    
    res.status(500).json({ 
      error: 'YouTube service is currently experiencing issues',
      details: 'Due to recent changes in YouTube\'s API and anti-bot measures, video downloading is temporarily limited. Please try again later or use alternative methods.'
    });
  }
}