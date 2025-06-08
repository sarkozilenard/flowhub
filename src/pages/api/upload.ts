import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB limit
    });

    const [fields, files] = await form.parse(req);
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.originalFilename || 'uploaded-file';
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const uniqueFileName = `${user.id}-${timestamp}-${baseName}${extension}`;

    // For now, let's use a simpler approach - store file temporarily and return file info
    // The actual conversion will handle the file processing
    const fileBuffer = fs.readFileSync(file.filepath);
    const base64Data = fileBuffer.toString('base64');

    // Clean up temporary file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({
      success: true,
      fileName: uniqueFileName,
      originalName: originalName,
      fileData: base64Data,
      fileSize: file.size,
      mimeType: file.mimetype
    });

  } catch (error: any) {
    console.error('File upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}