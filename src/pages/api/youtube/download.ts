import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import ytdl from 'ytdl-core';
import { exec } from 'youtube-dl-exec';

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

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Get video info
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;

    // Check if it's a playlist
    const isPlaylist = url.includes('playlist?list=') || url.includes('&list=');

    if (isPlaylist) {
      // Handle playlist download
      try {
        const playlistInfo = await exec(url, {
          dumpSingleJson: true,
          noCheckCertificates: true,
          noWarnings: true,
          preferFreeFormats: true,
          addHeader: ['referer:youtube.com', 'user-agent:googlebot']
        });

        const playlist = JSON.parse(playlistInfo.toString());
        
        res.status(200).json({
          type: 'playlist',
          title: playlist.title,
          uploader: playlist.uploader,
          videoCount: playlist.entries?.length || 0,
          videos: playlist.entries?.map((entry: any) => ({
            id: entry.id,
            title: entry.title,
            duration: entry.duration,
            url: `https://www.youtube.com/watch?v=${entry.id}`
          })) || [],
          downloadUrl: url,
          format,
          quality
        });
      } catch (playlistError) {
        console.error('Playlist processing error:', playlistError);
        return res.status(500).json({ error: 'Failed to process playlist' });
      }
    } else {
      // Handle single video download
      const formats = ytdl.filterFormats(info.formats, format === 'mp3' ? 'audioonly' : 'videoandaudio');
      
      let selectedFormat;
      if (quality === 'highest') {
        selectedFormat = ytdl.chooseFormat(formats, { quality: 'highestvideo' });
      } else if (quality === 'lowest') {
        selectedFormat = ytdl.chooseFormat(formats, { quality: 'lowestvideo' });
      } else {
        selectedFormat = ytdl.chooseFormat(formats, { quality });
      }

      res.status(200).json({
        type: 'video',
        title: videoDetails.title,
        author: videoDetails.author.name,
        duration: videoDetails.lengthSeconds,
        thumbnail: videoDetails.thumbnails[0]?.url,
        description: videoDetails.description,
        viewCount: videoDetails.viewCount,
        uploadDate: videoDetails.uploadDate,
        downloadUrl: selectedFormat?.url || url,
        format,
        quality,
        fileSize: selectedFormat?.contentLength
      });
    }
  } catch (error: any) {
    console.error('YouTube download error:', error);
    
    if (error?.message?.includes('Video unavailable')) {
      return res.status(404).json({ error: 'Video not found or unavailable' });
    } else if (error?.message?.includes('Private video')) {
      return res.status(403).json({ error: 'Private video cannot be downloaded' });
    } else if (error?.message?.includes('Age-restricted')) {
      return res.status(403).json({ error: 'Age-restricted video cannot be downloaded' });
    }
    
    res.status(500).json({ error: 'Failed to process YouTube URL' });
  }
}