import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    const supabase = createClient(req, res);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { fileUrl, inputFormat, outputFormat, options = {} } = req.body;

    if (!fileUrl || !inputFormat || !outputFormat) {
      return res.status(400).json({ 
        error: 'Missing required parameters: fileUrl, inputFormat, outputFormat' 
      });
    }

    const apiKey = process.env.CLOUDCONVERT_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'CloudConvert API key not configured' 
      });
    }

    // Create a CloudConvert job
    const jobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tasks: {
          'import-file': {
            operation: 'import/url',
            url: fileUrl
          },
          'convert-file': {
            operation: 'convert',
            input: 'import-file',
            input_format: inputFormat,
            output_format: outputFormat,
            options: options
          },
          'export-file': {
            operation: 'export/url',
            input: 'convert-file'
          }
        }
      })
    });

    if (!jobResponse.ok) {
      const errorData = await jobResponse.json();
      return res.status(jobResponse.status).json({ 
        error: 'CloudConvert job creation failed',
        details: errorData
      });
    }

    const jobData = await jobResponse.json();
    
    return res.status(200).json({
      success: true,
      jobId: jobData.data.id,
      status: 'processing',
      message: 'File conversion started successfully'
    });

  } catch (error: any) {
    console.error('File conversion error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}