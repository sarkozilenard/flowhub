import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, from, to } = req.body;

  if (!text || !from || !to) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Use LibreTranslate API (free translation service)
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error('Translation service error');
    }

    const data = await response.json();
    
    return res.status(200).json({
      translatedText: data.translatedText,
      originalText: text,
      from,
      to
    });
  } catch (error) {
    console.error('Translation error:', error);
    
    // Fallback to basic translations for common phrases
    const basicTranslations: Record<string, Record<string, string>> = {
      'en-hu': {
        'hello': 'helló',
        'goodbye': 'viszlát',
        'thank you': 'köszönöm',
        'please': 'kérem',
        'yes': 'igen',
        'no': 'nem',
        'good morning': 'jó reggelt',
        'good evening': 'jó estét',
        'how are you': 'hogy vagy',
        'i love you': 'szeretlek',
        'welcome': 'üdvözöljük',
        'excuse me': 'elnézést',
        'sorry': 'sajnálom',
        'help': 'segítség',
        'water': 'víz',
        'food': 'étel',
        'house': 'ház',
        'car': 'autó',
        'book': 'könyv',
        'computer': 'számítógép',
        'phone': 'telefon',
        'work': 'munka',
        'family': 'család',
        'friend': 'barát',
        'time': 'idő',
        'money': 'pénz',
        'today': 'ma',
        'tomorrow': 'holnap',
        'yesterday': 'tegnap'
      },
      'hu-en': {
        'helló': 'hello',
        'viszlát': 'goodbye',
        'köszönöm': 'thank you',
        'kérem': 'please',
        'igen': 'yes',
        'nem': 'no',
        'jó reggelt': 'good morning',
        'jó estét': 'good evening',
        'hogy vagy': 'how are you',
        'szeretlek': 'i love you',
        'üdvözöljük': 'welcome',
        'elnézést': 'excuse me',
        'sajnálom': 'sorry',
        'segítség': 'help',
        'víz': 'water',
        'étel': 'food',
        'ház': 'house',
        'autó': 'car',
        'könyv': 'book',
        'számítógép': 'computer',
        'telefon': 'phone',
        'munka': 'work',
        'család': 'family',
        'barát': 'friend',
        'idő': 'time',
        'pénz': 'money',
        'ma': 'today',
        'holnap': 'tomorrow',
        'tegnap': 'yesterday'
      }
    };

    const key = `${from}-${to}`;
    const lowerText = text.toLowerCase().trim();
    const fallbackTranslation = basicTranslations[key]?.[lowerText];
    
    if (fallbackTranslation) {
      return res.status(200).json({
        translatedText: fallbackTranslation,
        originalText: text,
        from,
        to,
        fallback: true
      });
    }

    return res.status(500).json({ 
      error: 'Translation service unavailable. Please try again later.',
      translatedText: `[Translation unavailable: ${text}]`,
      originalText: text,
      from,
      to,
      fallback: true
    });
  }
}