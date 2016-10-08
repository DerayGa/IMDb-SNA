"use strict";

const imdb = require('imdb-api');
const fs = require('fs');
const path = require('path');
const topMovie = require('../movies/top.json');

let targetMovieList = [];

Object.keys(topMovie).forEach((year) => {
  targetMovieList = targetMovieList.concat(topMovie[year]);
});

const dir = './movies/';
let num = 1;
const save_movie_to_json = (movieId) => {
  const existMovieList = fs.readdirSync(dir)
    .filter((name) => {
      const filename = path.join(dir, name);
      const stats = fs.statSync(filename);

      return (stats.isFile() && path.extname(filename) === '.json');
    }).map((name) => (name.replace('.json', '')));

  if (existMovieList.indexOf(movieId) > -1) {
    console.log(`${movieId} existed ${num}`);
    num++;
    if (targetMovieList.length)
      save_movie_to_json(targetMovieList.shift())
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
      console.log(`${movieId} Saved. ${num}`);
      num++;
      if (targetMovieList.length)
        save_movie_to_json(targetMovieList.shift())
    });
  });
}

if (targetMovieList.length)
  save_movie_to_json(targetMovieList.shift())
