import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

// Global variables
const TARGET_URL = 'https://otakudesu.cloud';
const JSON_PATH = './anime-list.json';
const animesData = [];
const axiosParams = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
  },
  withCredentials: true,
};

async function getHTMLSource(URL) {
  try {
    const response = await axios.get(URL, { ...axiosParams });
    const html = response.data;
    return html;
  } catch (error) {
    if (error.response) {
      console.error('The request was made and the server responded:');
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      console.error('The request was made but no response was recieved:');
      console.error(error.request);
    } else {
      console.error('Error', error.message);
    }
    console.error(error.config);
  }
}

async function getRedirectedURL(URL) {
  return await axios
    .get(URL)
    .then((response) => response.request.res.responseUrl);
}

async function getStreamURL(animePageURL) {
  const animePage = await getHTMLSource(animePageURL);
  const $animePage = cheerio.load(animePage);
  const latestEpsURL = $animePage('div.episodelist')
    .eq(1)
    .find('a')
    .first()
    .attr('href');

  const streamPage = await getHTMLSource(latestEpsURL);
  const $ = cheerio.load(streamPage);
  const pdrainLink = $('div.download')
    .find('strong:contains("Mp4 720p")')
    .siblings('a:contains("Pdrain")')
    .attr('href');
  const pdrainID = await getRedirectedURL(pdrainLink);

  return pdrainID.substring(25);
}

async function getAnimeData() {
  try {
    const mainPage = await getHTMLSource(TARGET_URL);
    const $mainPage = cheerio.load(mainPage);
    const firstAnimesContainer = $mainPage('.venz').first().find('li');
    for (const card of firstAnimesContainer) {
      const animeInfo = {
        title: $mainPage(card).find('h2.jdlflm').text().trim(),
        thumbnail: $mainPage(card).find('img').attr('src'),
        episode: $mainPage(card).find('div.epz').text().trim(),
        releaseDay: $mainPage(card).find('div.epztipe').text().trim(),
        releaseDate: $mainPage(card).find('div.newnime').text(),
        pdrainID: await getStreamURL($mainPage(card).find('a').attr('href')),
      };

      animesData.push(animeInfo);
    }
  } catch (error) {
    console.log(error.message);
  }
}

// Entry point
getAnimeData().then(() => {
  try {
    const serializedAnimesData = JSON.stringify(animesData, null, ' ');
    writeFileSync(JSON_PATH, serializedAnimesData, 'utf-8');
    console.log('Animes data successfully saved to disk.');
  } catch (error) {
    console.error(error.message);
  }
});
