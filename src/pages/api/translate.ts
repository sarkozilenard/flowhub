import { NextApiRequest, NextApiResponse } from 'next';

interface TranslationRequest {
  text: string;
  from: string;
  to: string;
}

interface TranslationResponse {
  translatedText: string;
  originalText: string;
  from: string;
  to: string;
  service: string;
  fallback?: boolean;
  error?: string;
  suggestion?: string;
}

// DeepL language code mapping
const DEEPL_LANGUAGE_MAP: { [key: string]: string } = {
  'en': 'EN',
  'hu': 'HU',
  'de': 'DE',
  'fr': 'FR',
  'es': 'ES',
  'it': 'IT',
  'pt': 'PT',
  'ru': 'RU',
  'ja': 'JA',
  'zh': 'ZH',
  'ko': 'KO',
  'nl': 'NL',
  'pl': 'PL',
  'sv': 'SV',
  'da': 'DA',
  'fi': 'FI',
  'no': 'NB',
  'cs': 'CS',
  'sk': 'SK',
  'sl': 'SL',
  'et': 'ET',
  'lv': 'LV',
  'lt': 'LT',
  'bg': 'BG',
  'ro': 'RO',
  'el': 'EL',
  'tr': 'TR',
  'uk': 'UK',
  'ar': 'AR',
  'hi': 'HI',
  'id': 'ID',
  'th': 'TH',
  'vi': 'VI'
};

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

// DeepL translation service
async function translateWithDeepL(text: string, from: string, to: string): Promise<string> {
  const deeplApiKey = process.env.DEEPL_API_KEY;
  
  if (!deeplApiKey) {
    throw new Error('DeepL API key not configured');
  }

  // Map language codes to DeepL format
  const sourceLang = DEEPL_LANGUAGE_MAP[from.toLowerCase()];
  const targetLang = DEEPL_LANGUAGE_MAP[to.toLowerCase()];

  if (!sourceLang || !targetLang) {
    throw new Error(`Unsupported language pair: ${from} -> ${to}`);
  }

  // Use DeepL Free API endpoint (change to api.deepl.com for Pro)
  const apiUrl = deeplApiKey.endsWith(':fx') 
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${deeplApiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text: text,
      source_lang: sourceLang,
      target_lang: targetLang,
    }),
    signal: AbortSignal.timeout(15000) // 15 second timeout
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.translations || data.translations.length === 0) {
    throw new Error('No translation returned from DeepL');
  }

  return data.translations[0].text;
}

// Fallback to LibreTranslate if DeepL fails
async function translateWithLibreTranslate(text: string, from: string, to: string): Promise<string> {
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
    }),
    signal: AbortSignal.timeout(10000) // 10 second timeout
  });

  if (!response.ok) {
    throw new Error(`LibreTranslate API error: ${response.status}`);
  }

  const data = await response.json();
  return data.translatedText;
}

// Try DeepL first, then fallback to LibreTranslate, then local fallback
async function translationServices(text: string, from: string, to: string): Promise<{ translatedText: string; service: string; fallback?: boolean }> {
  try {
    // Try DeepL first
    const translatedText = await translateWithDeepL(text, from, to);
    return { translatedText, service: 'deepl' };
  } catch (error) {
    console.error('DeepL translation failed, trying LibreTranslate fallback:', error);
    
    try {
      // Fallback to LibreTranslate
      const translatedText = await translateWithLibreTranslate(text, from, to);
      return { translatedText, service: 'libretranslate', fallback: true };
    } catch (fallbackError) {
      console.error('LibreTranslate also failed, using local fallback:', fallbackError);
      
      // Use local fallback
      const key = `${from}-${to}`;
      const lowerText = text.toLowerCase().trim();
      const fallbackTranslation = basicTranslations[key]?.[lowerText];
      
      if (fallbackTranslation) {
        return { translatedText: fallbackTranslation, service: 'offline', fallback: true };
      }
      
      throw new Error('All translation services failed');
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<TranslationResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      translatedText: '', 
      originalText: '',
      from: '',
      to: '',
      service: '',
      error: 'Method not allowed' 
    });
  }

  const { text, from, to } = req.body;

  if (!text || !from || !to) {
    return res.status(400).json({ 
      translatedText: '', 
      originalText: text || '',
      from: from || '',
      to: to || '',
      service: '',
      error: 'Missing required parameters' 
    });
  }

  try {
    const result = await translationServices(text, from, to);
    
    return res.status(200).json({
      translatedText: result.translatedText,
      originalText: text,
      from,
      to,
      service: result.service,
      fallback: result.fallback
    });
  } catch (error) {
    console.error('All translation services failed:', error);
    
    // Return a helpful error message
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
}