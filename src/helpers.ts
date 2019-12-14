import { Page } from 'puppeteer';

export const closeModal = async (page: Page) => page.keyboard.press('Escape');

export const randomize = (array: any[], randomIndex = Math.random()) =>
  Math.floor(randomIndex * (0 + array.length));

export const asyncForEach = async (array: string[], callback: any) => {
  const result = [];
  for (const item of array) {
    result.push(await callback(item));
  }
  return result;
};

export const createAd = (
  ad: string,
  split: number,
  preposition: string | null
): string => {
  return ad
    .split(' ')
    .slice(0, split)
    .join(' ')
    .concat(preposition ? ` ${preposition} ` : '');
};
