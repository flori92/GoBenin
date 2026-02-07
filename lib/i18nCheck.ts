import { translations } from '../contexts/LanguageContext.tsx';

const keysByLocale = Object.entries(translations).map(([locale, table]) => [locale, new Set(Object.keys(table))] as const);
const allKeys = new Set<string>();

for (const [, keys] of keysByLocale) {
  for (const key of keys) allKeys.add(key);
}

let hasError = false;

for (const [locale, keys] of keysByLocale) {
  const missing = [...allKeys].filter(key => !keys.has(key));
  if (missing.length > 0) {
    hasError = true;
    console.error(`[i18n] Missing keys for ${locale}: ${missing.join(', ')}`);
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log('[i18n] All locales have the same keys.');
}
