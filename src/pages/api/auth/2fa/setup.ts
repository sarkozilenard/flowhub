import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/util/supabase/api';
import prisma from '@/lib/prisma';
import speakeasy from 'speakeasy';
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

    // Generate a secret for the user
    const secret = speakeasy.generateSecret({
      name: `FlowHub (${user.email})`,
      issuer: 'FlowHub',
      length: 32
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Store the secret temporarily (not enabled yet)
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret.base32 }
    });

    res.status(200).json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}