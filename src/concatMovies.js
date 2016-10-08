"use strict";

const fs = require('fs');
const path = require('path');

const rootDir = '../movies/';
const dir = rootDir + 'id/';

const movieList = fs.readdirSync(dir)
  .filter((name) => {
    const filename = path.join(dir, name);
    const stats = fs.statSync(filename);

    return (stats.isFile() && path.extname(filename) === '.json');
  });

const allMovies = [];
movieList.forEach((movieFile, index) => {
  const filename = path.join(dir, movieFile);
  const movie = JSON.parse(fs.readFileSync(filename, 'utf8'));
  /*movie.genres = movie.genres.split(',').map((genre) => (
    genre.trim()
  ));
  movie.actors = movie.actors.split(',').map((actor) => (
    actor.trim()
  ));
  movie.languages = movie.languages.split(',').map((language) => (
    language.trim()
  ));
  movie.country = movie.country.split(',').map((country) => (
    country.trim()
  ));*/

  allMovies.push(movie);  
});

fs.writeFile(`${rootDir}movies.json`,
  JSON.stringify(allMovies, null, 2), (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`allMovies Saved.`);
});