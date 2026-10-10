import { en } from './en';
import { ta } from './ta';
import { Language } from '../types';

export const translations = {
  en,
  ta,
};

export type TranslationKeys = keyof typeof en;

export function getTranslation(lang: Language, key: TranslationKeys): string {
  const dict = translations[lang] || translations.ta;
  return dict[key] || translations.en[key] || String(key);
}
