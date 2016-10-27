
const fs = require('fs');
const request = require('request');
const path = require('path');
const jsdom = require('jsdom');
var wget = require('wget');
const fetch = require('node-fetch');

const movies = require('../data/movies.json');

const rootDir = '../data/';
const posterDir ='../res/posters/';
var count = movies.length;

const posterList = fs.readdirSync(posterDir)
  .filter((name) => {
    const filename = path.join(posterDir, name);
    const stats = fs.statSync(filename);

    return (stats.isFile() && path.extname(filename) === '.jpg');
  }).map((name) => (name.replace('.jpg', '')));

const checkCompleted = () => {
  if( count == 0) {
    console.log(`allMovies with Poster Saved.`);
  } else {
    idx++;
    getPosterById(movies[idx]);
  }
};

const download = (uri, filename, callback) => {
  request.head(uri, (err, res, body) => {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

const getPosterById = (movie) => {
  if (!movie) return;
  if (posterList.indexOf(movie.imdbid) > 0) {
    //console.log(movie.name, 'photo existed');
    count--;
    checkCompleted();
    return;
  }

  if (movie.poster.indexOf('http') == 0) {
    download(movie.poster, `${posterDir}${movie.imdbid}.jpg`, () => {
      console.log('save! ', movie.title, `#${idx}`);
      count--;

      checkCompleted();
    });
  } else {
    console.log('NOT found! ', movie.title, `#${idx}`);
    count--;

    checkCompleted();
  }
};

var idx = 0;
getPosterById(movies[idx]);
getPosterById(movies[++idx]);
getPosterById(movies[++idx]);
getPosterById(movies[++idx]);
