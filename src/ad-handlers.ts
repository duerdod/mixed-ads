import * as puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import { words } from './constans';
import { asyncForEach, closeModal, randomIndex } from './helpers';
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

    // TODO: Return at least 10-15 results to randomize from.
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
  const ads = [
    results[0][randomIndex(0, results[0].length)],
    results[0][randomIndex(0, results[0].length)]
  ];

  return formatAds(ads);
};

const formatAds = async (ads: string[]) => {
  let newAd = '';
  ads.forEach((ad: string, i: number) => {
    if (i === 0) {
      return (newAd +=
        ad
          .split(' ')
          .slice(0, 2)
          .join(' ') + ' med ');
    }
    return (newAd += ad
      .split(' ')
      .slice(0, 2)
      .join(' '));
  });

  return newAd;
};
