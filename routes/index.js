var express = require('express');
var axios = require('axios');
var cheerio = require('cheerio');
var router = express.Router();

const URL =  `http://ws.audioscrobbler.com/2.0/`;
const API_KEY = process.env.API_KEY;

router.get('/userDetails', async (req, res) => {
  const method = `user.getinfo`;
  const user = req.query.user;
  let response = await axios.get(URL, {
      params: {
        method,
        user,
        api_key: API_KEY,
        format: `json` 
      }
    }).then(res => res.data);
  res.send(response);
});

router.get('/recentTracks', async (req, res) => {
  const method = `user.getrecenttracks`;
  const user = req.query.user;
  let response = await axios.get(URL, {
      params: {
        method,
        user,
        api_key: API_KEY,
        format: `json` 
      }
    }).then(res => res.data.recenttracks.track);
  res.send(response);
});

router.get('/currentTrack', async (req, res) => {
  const method = `user.getrecenttracks`;
  const user = req.query.user;
  let response = await axios.get(URL, {
      params: {
        method,
        user,
        api_key: API_KEY,
        format: `json` 
      }
    }).then(res => res.data.recenttracks.track[0]);
  res.send(response["@attr"] && response["@attr"].nowplaying ? { ...response, nowplaying: true } : { nowplaying: false });
});

router.get('/lyrics', async (req, res) => {
  let track = req.query.track.toLowerCase().replace(/[^A-Za-z0-9]/g, '');
  let artist = req.query.artist.toLowerCase().replace(/[^A-Za-z0-9]/g, '');
  artist = artist.substring(0, 3) === "the" ? artist.substring(3) : artist;
  const url = `http://azlyrics.com/lyrics/${ artist }/${ track }.html`;
  let html = await axios.get(url).then(res => res.data);
  const $ = cheerio.load(html); 
  res.send({
    lyrics: $.text()
  });
});

module.exports = router;
