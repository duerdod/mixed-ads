import * as dotenv from 'dotenv';
import * as express from 'express';
import * as path from 'path';
import { fetchAds } from './ad-handlers';
dotenv.config();

const PORT = process.env.APP_PORT || 4000;

const startServer = () => {
  const app = express();
  app.set('view engine', 'pug');
  app.use('/public', express.static(path.join(__dirname, '../public')));

  app.get('/', async (req, res) => {
    res.render('index');
  });

  app.get('/ad', async (req, res) => {
    const ad = await fetchAds();
    return res.send({ ad });
  });

  app.listen({ port: PORT }, () =>
    console.log(`Server ready at http://localhost:${PORT}`)
  );
};

startServer();
