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