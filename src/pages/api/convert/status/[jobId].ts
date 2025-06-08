import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    const supabase = createClient(req, res);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { jobId } = req.query;

    if (!jobId || typeof jobId !== 'string') {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const apiKey = process.env.CLOUDCONVERT_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'CloudConvert API key not configured' 
      });
    }

    // Check job status
    const statusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!statusResponse.ok) {
      const errorData = await statusResponse.json();
      return res.status(statusResponse.status).json({ 
        error: 'Failed to check job status',
        details: errorData
      });
    }

    const statusData = await statusResponse.json();
    const job = statusData.data;
    
    // Find the export task to get download URL
    const exportTask = job.tasks?.find((task: any) => task.name === 'export-file');
    
    let downloadUrl = null;
    if (job.status === 'finished' && exportTask?.result?.files?.[0]?.url) {
      downloadUrl = exportTask.result.files[0].url;
    }

    return res.status(200).json({
      jobId: job.id,
      status: job.status,
      createdAt: job.created_at,
      startedAt: job.started_at,
      finishedAt: job.finished_at,
      downloadUrl,
      tasks: job.tasks?.map((task: any) => ({
        name: task.name,
        operation: task.operation,
        status: task.status,
        message: task.message
      }))
    });

  } catch (error: any) {
    console.error('Job status check error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}