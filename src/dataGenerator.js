"use strict";

const fs = require('fs');
const path = require('path');
const moviesFilter = require('./moviesFilter.js');
const allMovies = require('../movies/movies.json');
const allActors = require('../movies/actors.json').actors;

const rootDir = '../';
const photoDir ='../res/photos/';
//const movies = moviesFilter.filterByYear(2002, allMovies);
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

const movies = moviesFilter.filterBy({
  actor: 'Christian Bale',
  rating: 8,
}, allMovies);

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
console.log('Actors:', actors.length);

actors.forEach((actor) => {
  sna.nodes.push({
    id: actor.id,
    name: actor.name,
    photo: actor.photo || 'noPhoto.jpg',
    group: 0,
  });
});

movies.forEach((movie, index) => {
  movie.actors.forEach((source) => {
    const sourceId = findActorByName(source).id;
    movie.actors.forEach((target) => {
      const targetId = findActorByName(target).id;
      if (sourceId == targetId) 
        return;

      var link = sna.links.filter((link) => (
        (
          ( link.source == sourceId && link.target == targetId) || 
          ( link.source == targetId && link.target == sourceId)
        )
      ))[0];
      if (!link) {
        link = { source: sourceId, target: targetId, value: 0};
        sna.links.push(link);
      }
      link.value++;
      //console.log(source, target)
    });
  });
});
console.log('links:', sna.links.length);

fs.writeFile(`${rootDir}test.json`,
  JSON.stringify(sna, null, 2), (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`sna Saved.`);
});