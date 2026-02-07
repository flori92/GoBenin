import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve(process.cwd(), 'contexts', 'LanguageContext.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const extractBlock = (label) => {
  const start = content.indexOf(`${label}: {`);
  if (start === -1) return null;
  let i = start + `${label}: {`.length;
  let depth = 1;
  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === '{') depth += 1;
    if (ch === '}') depth -= 1;
    i += 1;
  }
  return content.slice(start + `${label}: {`.length, i - 1);
};

const extractKeys = (block) => {
  if (!block) return [];
  const keys = [];
  const regex = /\n\s*([a-zA-Z0-9_]+)\s*:/g;
  let match;
  while ((match = regex.exec(block)) !== null) {
    keys.push(match[1]);
  }
  return keys;
};

const enBlock = extractBlock('en');
const frBlock = extractBlock('fr');

if (!enBlock || !frBlock) {
  console.error('[i18n] Could not parse LanguageContext.tsx');
  process.exit(1);
}

const enKeys = new Set(extractKeys(enBlock));
const frKeys = new Set(extractKeys(frBlock));
const allKeys = new Set([...enKeys, ...frKeys]);

let hasError = false;
const missingEn = [...allKeys].filter(k => !enKeys.has(k));
const missingFr = [...allKeys].filter(k => !frKeys.has(k));

if (missingEn.length) {
  hasError = true;
  console.error(`[i18n] Missing keys for en: ${missingEn.join(', ')}`);
}
if (missingFr.length) {
  hasError = true;
  console.error(`[i18n] Missing keys for fr: ${missingFr.join(', ')}`);
}

if (hasError) process.exit(1);
console.log('[i18n] All locales have the same keys.');
