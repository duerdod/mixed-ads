import * as puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import { words } from './constans';
import { asyncForEach, closeModal, randomIndex, createAd } from './helpers';
dotenv.config();

const endpoint = process.env.BASE_ENDPOINT;
const headless = true;

export const fetchAds = async () => {
  console.log('Launch browser.');
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();

  const handleSearch = async (query: string) => {
    console.log(`Searching for ${query}`);

    await page.goto(`${endpoint}/?q=${query}`);
    await closeModal(page);

    await page.waitForSelector('[class*="SearchResults__"]');

    const results = await page.$$eval(
      '[class*="SearchResults__"] > div',
      divs => divs.map(div => div.getAttribute('aria-label') || 'Nej')
    );

    return results;
  };

  const wordsToSearchFor = [
    words[randomIndex(0, words.length)],
    words[randomIndex(0, words.length)]
  ];

  const results = await asyncForEach(wordsToSearchFor, handleSearch);

  browser.close();
  return formatAds(results[0]);
};

const formatAds = async (ads: string[]) => {
  const newAd = ads
    .map((ad: string, i: number) =>
      i === 0 ? createAd(ad, 2, 'med') : createAd(ad, 2, null)
    )
    .join(' ');
  return newAd;
};
