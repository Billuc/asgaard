import { customAlphabet, urlAlphabet } from 'nanoid';

const nanoid = customAlphabet(urlAlphabet.replace('-', '').replace('_', ''), 12);

export function generateId(prefix?: string): string {
  if (prefix) {
    return `${prefix}-${nanoid()}`;
  } else {
    return nanoid();
  }
}
