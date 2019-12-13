import { Page } from 'puppeteer';

export const closeModal = async (page: Page) => page.keyboard.press('Escape');

export const randomIndex = (
  min: number,
  max: number,
  randomIndex = Math.random()
) => Math.floor(randomIndex * (min + max) - min);

export const asyncForEach = async (array: any, cb: any) => {
  const result = [];
  for (const item of array) {
    result.push(await cb(item));
  }
  return result;
};
