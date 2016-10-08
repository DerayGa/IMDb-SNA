"use strict";

const fs = require('fs');

const moviesFilter = require('./moviesFilter.js');
const movies = require('../movies/movies.json');

const rootDir = '../movies/';
const allActors = [];

movies.forEach((movie) => {
  const actors = movie.actors.split(',').map((actor) => (
    actor.trim()
  ));
  actors.forEach((actor) => {
    if (allActors.indexOf(actor) < 0) {
      allActors.push(actor);
    }
  });
});

fs.writeFile(`${rootDir}actors.json`,
  JSON.stringify({ actors: allActors }, null, 2), (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`allActors Saved.`);
});