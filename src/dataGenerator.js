"use strict";

const fs = require('fs');
const path = require('path');
const moviesFilter = require('./moviesFilter.js');
const allMovies = require('../data/movies.json');
const allActors = require('../data/actors.json').actors;

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
//const condition = { actor: 'Heath Ledger' };
//const condition = { actor: 'Johnny Depp' };
//const condition = { actor: 'Brad Pitt' };
//const condition = { actor: 'Angelina Jolie' };

//const condition = { actor: 'Russell Crowe' };//2000
//const condition = { actor: 'Denzel Washington' };//2001
//const condition = { actor: 'Adrien Brody' };//2002
//const condition = { actor: 'Sean Penn' };//2003, 2008
//const condition = { actor: 'Jamie Foxx' };//2004
//const condition = { actor: 'Philip Seymour Hoffman' };//2005
//const condition = { actor: 'Forest Whitaker' };//2006
//const condition = { actor: 'Daniel Day-Lewis' };//2007, 2012
//const condition = { actor: 'Jeff Bridges' };//2009
//const condition = { actor: 'Colin Firth' };//2010
//const condition = { actor: 'Jean Dujardin' };//2011
//const condition = { actor: 'Matthew McConaughey' };//2013
//const condition = { actor: 'Eddie Redmayne' };//2014
const condition = { actor: 'Leonardo DiCaprio' };//2015

//const condition = { director: 'Christopher Nolan' };
//const condition = { director: 'Steven Soderbergh' };//2000
//const condition = { director: 'Ron Howard' };//2001
//const condition = { director: 'Roman Polanski' };//2002
//const condition = { director: 'Peter Jackson' };//2003
//const condition = { director: 'Clint Eastwood' };//2004
//const condition = { director: 'Ang Lee' };//2005, 2012
//const condition = { director: 'Martin Scorsese' };//2006
//const condition = { director: 'Joel Coen' };//2007
//const condition = { director: 'Danny Boyle' };//2008
//const condition = { director: 'Kathryn Bigelow' };//2009
//const condition = { director: 'Tom Hooper' };//2010
//const condition = { director: 'Michel Hazanavicius' };//2011
//const condition = { director: 'Alfonso Cuarón' };//2013
//const condition = { director: 'Alejandro G. Iñárritu' };//2014, 2015

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