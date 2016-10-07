"use strict";

const imdb = require('imdb-api');
const fs = require('fs');
const path = require('path');

const dir = './movies/';

const existMovieList = fs.readdirSync(dir)
  .filter((name) => {
    const filename = path.join(dir, name);
    const stats = fs.statSync(filename);

    return (stats.isFile() && path.extname(filename) === '.json');
  }).map((name) => (name.replace('.json', '')));

const targetMovieList = ['tt3263904'];

targetMovieList.forEach((movieId) => {
  if (existMovieList.indexOf(movieId) > -1) {
    console.log(`${movieId} existed`);
    return;
  }
  imdb.getReq({ id: movieId }, (err, movie) => {
    if (err) {
      return console.error(err);
    }
    fs.writeFile(`${dir}${movie.imdbid}.json`,
      JSON.stringify(movie, null, 2), (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(`${movieId} Saved.`);
    });
  });
});
