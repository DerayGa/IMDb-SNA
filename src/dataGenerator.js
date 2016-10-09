"use strict";

const fs = require('fs');
const path = require('path');
const moviesFilter = require('./moviesFilter.js');
const allMovies = require('../movies/movies.json');
const allActors = require('../movies/actors.json').actors;

const rootDir = '../';
const photoDir ='../res/photos/';

//const movies = moviesFilter.filterByRating(8, allMovies);
//const movies = moviesFilter.filterByGenre('Sci-Fi', allMovies);
//const movies = moviesFilter.filterByActor('Christian Bale', allMovies);
//const movies = moviesFilter.filterByDirector('Christopher Nolan', allMovies);
/*const movies = moviesFilter.filterBy({
  year: 2000,
  genre: 'Sci-Fi'
}, allMovies);*/

fs.readdirSync(photoDir)
  .filter((name) => {
    const filename = path.join(photoDir, name);
    const stats = fs.statSync(filename);

    return (stats.isFile() && path.extname(filename) === '.jpg');
  }).forEach((photo) => {
    allActors.forEach((actor) => {
      if (photo.indexOf(actor.id) == 0) {
        actor.photo = photo;
      }
    });
  });

//const condition = { actor: 'Christian Bale' };
//const condition = { actor: 'Tom Cruise' };
//const condition = { actor: 'Robert Downey Jr.' };
//const condition = { actor: 'Daniel Radcliffe' };
const condition = { actor: 'Heath Ledger' };

//const condition = { director: 'Christopher Nolan' };
//const condition = { director: 'Christopher Nolan' };

//const condition = { genre: 'Sci-Fi', rating: 8 };
//const condition = { genre: 'Sci-Fi' };
//const condition = { genre: 'Comedy' };
//const condition = { year: '2016' };
//const condition = { rating: 8.6 };
//const condition = {};

const movies = moviesFilter.filterBy(condition, allMovies);

var actors = [];

const sna = {
  nodes: [],
  links: []
};

console.log('Movie:', movies.length);

//change actors from string to array
movies.forEach((movie, index) => {
  movie.actors = movie.actors.split(',').map((actor) => (
    actor.trim()
  ));

  movie.actors.forEach((actor) => {
    if (actors.indexOf(actor) < 0) {
      actors.push(actor);
    }
  });
});

actors.sort();

const findActorByName = (name) => (
  allActors.filter((actor) => (actor.name == name))[0]
)
actors = actors.map(findActorByName);

actors.forEach((actor) => {
  //ignore those who have no photo(sorry~)
  if (!actor.photo) return;

  sna.nodes.push({
    id: actor.id,
    name: actor.name,
    photo: actor.photo,
    group: 0,
  });
});
console.log('Actors:', sna.nodes.length);

movies.forEach((movie, index) => {
  movie.actors.forEach((sourceName) => {
    const source = findActorByName(sourceName);
    if (!source.photo)
      return;

    movie.actors.forEach((targetName) => {
      const target = findActorByName(targetName);
      if (!target.photo)
        return;

      if (source.id == target.id) 
        return;

      var link = sna.links.filter((link) => (
        (
          ( link.source == source.id && link.target == target.id) || 
          ( link.source == target.id && link.target == source.id)
        )
      ))[0];
      if (!link) {
        link = { source: source.id, target: target.id, value: 0};
        sna.links.push(link);
      }
      
      link.value = (link.value) ? link.value*2 : 1;
    });
  });
});
console.log('Links:', sna.links.length);

fs.writeFile(`${rootDir}test.json`,
  JSON.stringify(sna, null, 2), (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`sna Saved.`);
});