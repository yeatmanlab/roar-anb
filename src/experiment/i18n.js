import i18next from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en/translation.json';

const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  name: 'defaultToEnglish',
  lookup(options) {
    return 'en';
  },
})

// To change the language with a querystring, append "?lng=LANGUAGE" to the the URL
// LANGUAGE here refers to the the language code

i18next
  .use(LanguageDetector)
  // .on('initialized', handleLanguageDetection)
  .init({
    debug: false,
    // which langauage codes to use. Ex. if 'en-US' detected, will use 'en'
    load: 'languageOnly',
    fallbackLng: 'en',
    detection: {
      order: ['defaultToEnglish', 'querystring'],
    },
    resources: {
      en: {
        translation: enTranslations,
      },
      es: {
        translation: 'esTranslations',
      },
      it: {
        translation: 'itTranslations',
      },
    },
  });
