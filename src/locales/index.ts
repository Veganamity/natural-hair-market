import { fr } from './fr';
import { en } from './en';
import { es } from './es';
import { de } from './de';
import { ar } from './ar';

export type Language = 'fr' | 'en' | 'es' | 'de' | 'ar';

export const translations = {
  fr,
  en,
  es,
  de,
  ar,
};

export type TranslationKeys = typeof fr;
