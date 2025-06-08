import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, from, to } = req.body;

  if (!text || !from || !to) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Enhanced fallback translations for common phrases
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
      'good night': 'jó éjszakát',
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
      'yesterday': 'tegnap',
      'what': 'mi',
      'where': 'hol',
      'when': 'mikor',
      'why': 'miért',
      'how': 'hogyan',
      'who': 'ki',
      'beautiful': 'szép',
      'good': 'jó',
      'bad': 'rossz',
      'big': 'nagy',
      'small': 'kicsi',
      'hot': 'forró',
      'cold': 'hideg',
      'happy': 'boldog',
      'sad': 'szomorú',
      'love': 'szerelem',
      'peace': 'béke',
      'war': 'háború',
      'life': 'élet',
      'death': 'halál',
      'birth': 'születés',
      'school': 'iskola',
      'teacher': 'tanár',
      'student': 'diák',
      'doctor': 'orvos',
      'hospital': 'kórház',
      'medicine': 'gyógyszer',
      'city': 'város',
      'country': 'ország',
      'world': 'világ',
      'earth': 'föld',
      'sky': 'ég',
      'sun': 'nap',
      'moon': 'hold',
      'star': 'csillag',
      'tree': 'fa',
      'flower': 'virág',
      'animal': 'állat',
      'dog': 'kutya',
      'cat': 'macska',
      'bird': 'madár',
      'fish': 'hal'
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
      'jó éjszakát': 'good night',
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
      'tegnap': 'yesterday',
      'mi': 'what',
      'hol': 'where',
      'mikor': 'when',
      'miért': 'why',
      'hogyan': 'how',
      'ki': 'who',
      'szép': 'beautiful',
      'jó': 'good',
      'rossz': 'bad',
      'nagy': 'big',
      'kicsi': 'small',
      'forró': 'hot',
      'hideg': 'cold',
      'boldog': 'happy',
      'szomorú': 'sad',
      'szerelem': 'love',
      'béke': 'peace',
      'háború': 'war',
      'élet': 'life',
      'halál': 'death',
      'születés': 'birth',
      'iskola': 'school',
      'tanár': 'teacher',
      'diák': 'student',
      'orvos': 'doctor',
      'kórház': 'hospital',
      'gyógyszer': 'medicine',
      'város': 'city',
      'ország': 'country',
      'világ': 'world',
      'föld': 'earth',
      'ég': 'sky',
      'nap': 'sun',
      'hold': 'moon',
      'csillag': 'star',
      'fa': 'tree',
      'virág': 'flower',
      'állat': 'animal',
      'kutya': 'dog',
      'macska': 'cat',
      'madár': 'bird',
      'hal': 'fish'
    }
  };

  // Try multiple translation services
  const translationServices = [
    // LibreTranslate (free)
    async () => {
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
        throw new Error('LibreTranslate service error');
      }

      const data = await response.json();
      return data.translatedText;
    },
    
    // Alternative LibreTranslate instance
    async () => {
      const response = await fetch('https://translate.argosopentech.com/translate', {
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
        throw new Error('Alternative LibreTranslate service error');
      }

      const data = await response.json();
      return data.translatedText;
    }
  ];

  // Try each translation service
  for (const service of translationServices) {
    try {
      const translatedText = await service();
      return res.status(200).json({
        translatedText,
        originalText: text,
        from,
        to,
        service: 'online'
      });
    } catch (error) {
      console.error('Translation service failed:', error);
      continue;
    }
  }

  // If all services fail, use local fallback
  const key = `${from}-${to}`;
  const lowerText = text.toLowerCase().trim();
  const fallbackTranslation = basicTranslations[key]?.[lowerText];
  
  if (fallbackTranslation) {
    return res.status(200).json({
      translatedText: fallbackTranslation,
      originalText: text,
      from,
      to,
      fallback: true,
      service: 'offline'
    });
  }

  // If no fallback available, return a helpful message
  return res.status(200).json({ 
    error: 'Translation service temporarily unavailable',
    translatedText: `[Translation unavailable: ${text}]`,
    originalText: text,
    from,
    to,
    fallback: true,
    service: 'offline',
    suggestion: 'Try translating common words or phrases, or try again later when online services are available.'
  });
}