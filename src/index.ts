// import * as express from "express";
import * as puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { Page } from 'puppeteer';
import { words } from './constans';
import { asyncForEach, closeModal, randomIndex } from './helpers';
dotenv.config();

randomIndex(0, words.length);

const headless = true;
const baseEndpoint = `https://www.blocket.se/annonser/hela_sverige`;
const PORT = process.env.APP_PORT || 4000;

const handleAds = async (ads: string[]) => {
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
      .slice(0, 3)
      .join(' '));
  });
  console.log(newAd);
  return newAd;
};

const fetchAds = async () => {
  const browser = await puppeteer.launch({ headless });
  console.log('Launch browser.');
  // To remove ev. popup.
  const handleSearch = async (query: string) => {
    console.log(`Searching for ${query}`);
    const page = await browser.newPage();
    await page.goto(`${baseEndpoint}/?q=${query}`);
    await closeModal(page);
    // TODO: Return at least 10-15 results to randomize from.
    const result = await page.$eval(
      '[class*="SearchResults__"]',
      el => el.children[0].getAttribute('aria-label') || 'No result.'
    );
    return result;
  };
  const wordsToSearchFor = [
    words[randomIndex(0, words.length)],
    words[randomIndex(0, words.length)]
  ];

  const results = await asyncForEach(wordsToSearchFor, handleSearch);
  return handleAds(results);
};

const startServer = async () => {
  const app = express();
  app.get('/', () => {
    fetchAds();
  });

  app.listen({ port: PORT }, () =>
    console.log(`Server ready at http://localhost:${PORT}`)
  );
};

startServer();
