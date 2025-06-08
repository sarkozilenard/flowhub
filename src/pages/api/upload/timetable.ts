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

  const supabase = createClient(req, res);

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(400).json({ error: 'Failed to parse form data' });
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        // Read file data
        const fileData = fs.readFileSync(file.filepath);
        const fileName = file.originalFilename || 'timetable';
        const fileExtension = path.extname(fileName);
        const uniqueFileName = `${user.id}/${Date.now()}-${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('timetables')
          .upload(uniqueFileName, fileData, {
            contentType: file.mimetype || 'application/octet-stream',
            upsert: false
          });

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          return res.status(500).json({ error: 'Failed to upload file' });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('timetables')
          .getPublicUrl(uniqueFileName);

        // Clean up temporary file
        fs.unlinkSync(file.filepath);

        res.status(200).json({
          fileName: fileName,
          fileUrl: urlData.publicUrl,
          fileSize: file.size,
          fileType: file.mimetype || 'application/octet-stream',
          uploadPath: uploadData.path
        });

      } catch (error) {
        console.error('File processing error:', error);
        
        // Clean up temporary file if it exists
        try {
          if (file.filepath) {
            fs.unlinkSync(file.filepath);
          }
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
        
        res.status(500).json({ error: 'Failed to process file' });
      }
    });

  } catch (error) {
    console.error('Upload API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}