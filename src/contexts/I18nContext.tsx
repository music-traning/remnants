import React, { type ReactNode, createContext, useContext, useState } from 'react';
import { ja } from '../locales/ja';
import { en } from '../locales/en';

type Language = 'ja' | 'en';
type Dictionary = typeof ja;
type TranslationKey = keyof Dictionary;

interface I18nContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextProps>({
  language: 'ja',
  setLanguage: () => {},
  t: (key) => key,
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ja');

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dictionary = language === 'ja' ? ja : en;
    let str = dictionary[key];
    if (!str) return key;

    if (params) {
      Object.keys(params).forEach((paramKey) => {
        str = str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(params[paramKey]));
      });
    }

    return str;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
