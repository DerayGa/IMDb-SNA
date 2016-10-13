"use strict";

const fs = require('fs');
const moviesFilter = require('./moviesFilter.js');
const movies = require('../data/movies.json');

const rootDir = '../data/';
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

allActors.sort();

const result = { actors: [] };
allActors.forEach((actor) => {
  result.actors.push({ name: actor, id: '' });
});

fs.writeFile(`${rootDir}actors.json`,
  JSON.stringify(result, null, 2), (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`allActors Saved.`);
});