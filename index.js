"use strict";

const moviesFilter = require('./src/moviesFilter.js');
const movies = require('./movies/movies.json');

//const result = moviesFilter.filterByYear(2002, movies);
//const result = moviesFilter.filterByRating(8, movies);
//const result = moviesFilter.filterByGenre('Sci-Fi', movies);
//const result = moviesFilter.filterByActor('Christian Bale', movies);
//const result = moviesFilter.filterByDirector('Christopher Nolan', movies);
/*const result = moviesFilter.filterBy({
  year: 2012,
  rating: 8,
  genre: 'Sci-Fi'
}, movies);*/
const result = moviesFilter.filterBy({
  actor: 'Adrián Navarro'
}, movies);

console.log(result)