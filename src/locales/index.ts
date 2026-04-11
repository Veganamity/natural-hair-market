import { fr } from './fr';
import { en } from './en';
import { es } from './es';
import { de } from './de';

export type Language = 'fr' | 'en' | 'es' | 'de';

export const translations = {
  fr,
  en,
  es,
  de,
};

export type TranslationKeys = typeof fr;
