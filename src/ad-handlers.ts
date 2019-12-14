import * as puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import { words } from './constans';
import { asyncForEach, closeModal, randomize, createAd } from './helpers';
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
      divs => divs.map(div => div.getAttribute('aria-label'))
    );

    return results;
  };

  const [resultsOne, resultsTwo] = await asyncForEach(
    [words[randomize(words)], words[randomize(words)]],
    handleSearch
  );
  const results = [...resultsOne, ...resultsTwo].filter(Boolean);

  browser.close();
  return formatAds(results);
};

const formatAds = async (ads: string[]) => {
  const adsToMake = [ads[randomize(ads)], ads[randomize(ads)]];
  const newAd = adsToMake
    .map((ad: string, i: number) =>
      i === 0 ? createAd(ad, 2, 'och') : createAd(ad, 2, null)
    )
    .join(' ');
  return newAd;
};
