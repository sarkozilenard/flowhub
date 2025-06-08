import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hu';

interface Translations {
  [key: string]: {
    en: string;
    hu: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.overview': { en: 'Overview', hu: 'Áttekintés' },
  'nav.todos': { en: 'To-Dos', hu: 'Feladatok' },
  'nav.notes': { en: 'Notes', hu: 'Jegyzetek' },
  'nav.links': { en: 'Links', hu: 'Linkek' },
  'nav.tools': { en: 'Tools', hu: 'Eszközök' },
  'nav.chat': { en: 'AI Chat', hu: 'AI Chat' },
  
  // Common
  'common.loading': { en: 'Loading...', hu: 'Betöltés...' },
  'common.save': { en: 'Save', hu: 'Mentés' },
  'common.cancel': { en: 'Cancel', hu: 'Mégse' },
  'common.delete': { en: 'Delete', hu: 'Törlés' },
  'common.edit': { en: 'Edit', hu: 'Szerkesztés' },
  'common.add': { en: 'Add', hu: 'Hozzáadás' },
  'common.create': { en: 'Create', hu: 'Létrehozás' },
  'common.search': { en: 'Search', hu: 'Keresés' },
  'common.filter': { en: 'Filter', hu: 'Szűrés' },
  'common.copy': { en: 'Copy', hu: 'Másolás' },
  'common.send': { en: 'Send', hu: 'Küldés' },
  
  // Dashboard
  'dashboard.title': { en: 'Your Productivity Hub', hu: 'Az Ön Produktivitási Központja' },
  'dashboard.subtitle': { en: 'Manage your tasks, notes, and tools all in one place', hu: 'Kezelje feladatait, jegyzeteit és eszközeit egy helyen' },
  'dashboard.welcome': { en: 'Welcome back', hu: 'Üdvözöljük újra' },
  
  // Todos
  'todos.title': { en: 'Your Tasks', hu: 'Az Ön Feladatai' },
  'todos.add': { en: 'Add Task', hu: 'Feladat Hozzáadása' },
  'todos.addFirst': { en: 'Add Your First Task', hu: 'Adja Hozzá Az Első Feladatát' },
  'todos.noTasks': { en: 'No tasks found', hu: 'Nem található feladat' },
  'todos.searchPlaceholder': { en: 'Search tasks...', hu: 'Feladatok keresése...' },
  'todos.all': { en: 'All Tasks', hu: 'Minden Feladat' },
  'todos.pending': { en: 'Pending', hu: 'Függőben' },
  'todos.completed': { en: 'Completed', hu: 'Befejezett' },
  'todos.priority.low': { en: 'Low', hu: 'Alacsony' },
  'todos.priority.medium': { en: 'Medium', hu: 'Közepes' },
  'todos.priority.high': { en: 'High', hu: 'Magas' },
  
  // Notes
  'notes.title': { en: 'Your Notes', hu: 'Az Ön Jegyzetei' },
  'notes.add': { en: 'Add Note', hu: 'Jegyzet Hozzáadása' },
  'notes.addFirst': { en: 'Add Your First Note', hu: 'Adja Hozzá Az Első Jegyzetét' },
  'notes.noNotes': { en: 'No notes yet', hu: 'Még nincsenek jegyzetek' },
  
  // Links
  'links.title': { en: 'Short Links', hu: 'Rövid Linkek' },
  'links.create': { en: 'Create Link', hu: 'Link Létrehozása' },
  'links.createFirst': { en: 'Create Your First Link', hu: 'Hozza Létre Az Első Linkjét' },
  'links.noLinks': { en: 'No short links yet', hu: 'Még nincsenek rövid linkek' },
  
  // Tools
  'tools.title': { en: 'Productivity Tools', hu: 'Produktivitási Eszközök' },
  'tools.textConverter': { en: 'Text Case Converter', hu: 'Szöveg Konvertáló' },
  'tools.unitConverter': { en: 'Unit Converter', hu: 'Mértékegység Konvertáló' },
  'tools.translator': { en: 'Language Translator', hu: 'Nyelvi Fordító' },
  'tools.fileSizeConverter': { en: 'File Size Converter', hu: 'Fájlméret Konvertáló' },
  
  // Forms
  'form.title': { en: 'Title', hu: 'Cím' },
  'form.description': { en: 'Description', hu: 'Leírás' },
  'form.content': { en: 'Content', hu: 'Tartalom' },
  'form.priority': { en: 'Priority', hu: 'Prioritás' },
  'form.dueDate': { en: 'Due Date', hu: 'Határidő' },
  'form.tags': { en: 'Tags', hu: 'Címkék' },
  'form.originalUrl': { en: 'Original URL', hu: 'Eredeti URL' },
  'form.customCode': { en: 'Custom Code', hu: 'Egyéni Kód' },
  
  // Messages
  'message.success': { en: 'Success', hu: 'Sikeres' },
  'message.error': { en: 'Error', hu: 'Hiba' },
  'message.copied': { en: 'Copied!', hu: 'Másolva!' },
  'message.signOut': { en: 'Sign Out', hu: 'Kijelentkezés' },
  
  // Homepage
  'home.title': { en: 'FlowHub - Your All-in-One Productivity Suite', hu: 'FlowHub - Az Ön Mindent Egyben Produktivitási Csomagja' },
  'home.description': { en: 'A modern all-in-one web application for daily productivity, utilities, and personal tools. Streamline your workflow with FlowHub.', hu: 'Modern mindent egyben webalkalmazás napi produktivitáshoz, segédprogramokhoz és személyes eszközökhöz. Egyszerűsítse munkafolyamatát a FlowHub-bal.' },
  'home.hero.title': { en: 'Your All-in-One\nProductivity Hub', hu: 'Az Ön Mindent Egyben\nProduktivitási Központja' },
  'home.hero.subtitle': { en: 'Streamline your daily workflow with powerful tools for task management, note-taking, file conversion, and more. All in one beautiful, secure platform.', hu: 'Egyszerűsítse napi munkafolyamatát hatékony eszközökkel feladatkezeléshez, jegyzeteléshez, fájlkonverzióhoz és még sok máshoz. Minden egy gyönyörű, biztonságos platformon.' },
  'home.hero.startJourney': { en: 'Start Your Journey', hu: 'Kezdje El Útját' },
  'home.hero.signIn': { en: 'Sign In', hu: 'Bejelentkezés' },
  'home.help': { en: 'Help', hu: 'Segítség' },
  'home.getStarted': { en: 'Get Started', hu: 'Kezdés' },
  
  // Features
  'home.features.title': { en: 'Everything You Need in One Place', hu: 'Minden Amire Szüksége Van Egy Helyen' },
  'home.features.subtitle': { en: 'Powerful tools designed to boost your productivity and simplify your digital life', hu: 'Hatékony eszközök, amelyek növelik produktivitását és egyszerűsítik digitális életét' },
  'home.features.todos.title': { en: 'Smart To-Do Lists', hu: 'Intelligens Feladatlisták' },
  'home.features.todos.description': { en: 'Organize your tasks with intelligent filtering and sorting', hu: 'Szervezze feladatait intelligens szűréssel és rendezéssel' },
  'home.features.calendar.title': { en: 'Calendar & Events', hu: 'Naptár és Események' },
  'home.features.calendar.description': { en: 'Never miss important dates with our integrated calendar system', hu: 'Soha ne mulasszon el fontos dátumokat integrált naptárrendszerünkkel' },
  'home.features.notes.title': { en: 'Notes & Documentation', hu: 'Jegyzetek és Dokumentáció' },
  'home.features.notes.description': { en: 'Create and manage your notes with rich text editing', hu: 'Hozzon létre és kezeljen jegyzeteket gazdag szövegszerkesztéssel' },
  'home.features.links.title': { en: 'Link Shortener', hu: 'Link Rövidítő' },
  'home.features.links.description': { en: 'Create custom short links and track their performance', hu: 'Hozzon létre egyéni rövid linkeket és kövesse nyomon teljesítményüket' },
  'home.features.converters.title': { en: 'Smart Converters', hu: 'Intelligens Konvertálók' },
  'home.features.converters.description': { en: 'Convert units, currencies, and file formats effortlessly', hu: 'Konvertáljon mértékegységeket, valutákat és fájlformátumokat könnyedén' },
  'home.features.chat.title': { en: 'AI Chat Assistant', hu: 'AI Chat Asszisztens' },
  'home.features.chat.description': { en: 'Get help and answers with integrated ChatGPT', hu: 'Kapjon segítséget és válaszokat az integrált ChatGPT-vel' },
  
  // File Converters
  'home.converters.title': { en: 'Comprehensive File Conversion Tools', hu: 'Átfogó Fájlkonverziós Eszközök' },
  'home.converters.subtitle': { en: 'Convert between dozens of file formats with ease. From audio and video to documents and archives, we\'ve got you covered.', hu: 'Konvertáljon tucatnyi fájlformátum között könnyedén. Hangtól és videótól a dokumentumokig és archívumokig, mindent lefedünk.' },
  
  // Benefits
  'home.benefits.title': { en: 'Why Choose FlowHub?', hu: 'Miért Válassza a FlowHub-ot?' },
  'home.benefits.subtitle': { en: 'Built with modern technology and user experience in mind', hu: 'Modern technológiával és felhasználói élményre összpontosítva építve' },
  'home.benefits.fast.title': { en: 'Lightning Fast', hu: 'Villámgyors' },
  'home.benefits.fast.description': { en: 'Built for speed and efficiency in your daily workflow', hu: 'Sebességre és hatékonyságra építve napi munkafolyamatában' },
  'home.benefits.secure.title': { en: 'Secure & Private', hu: 'Biztonságos és Privát' },
  'home.benefits.secure.description': { en: 'Your data is fully isolated and protected', hu: 'Az Ön adatai teljesen elkülönítettek és védettek' },
  'home.benefits.scalable.title': { en: 'Personal & Scalable', hu: 'Személyes és Skálázható' },
  'home.benefits.scalable.description': { en: 'Designed for personal use but ready to grow', hu: 'Személyes használatra tervezve, de készen áll a növekedésre' },
  
  // CTA
  'home.cta.title': { en: 'Ready to Transform Your Productivity?', hu: 'Készen Áll Produktivitása Átalakítására?' },
  'home.cta.subtitle': { en: 'Join thousands of users who have streamlined their workflow with FlowHub', hu: 'Csatlakozzon több ezer felhasználóhoz, akik egyszerűsítették munkafolyamatukat a FlowHub-bal' },
  'home.cta.getStartedFree': { en: 'Get Started for Free', hu: 'Kezdés Ingyen' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};