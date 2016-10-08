"use strict";

const fs = require('fs');
const path = require('path');
//const movies = require('./movies/movies.json');

const filterBy = (key) => (value, target) => (
  target.filter((movie) => (
    (movie[key].indexOf(value) > -1)
  ))
)

const filterByYear = (year, target) => (
  target.filter((movie) => (
    (movie.year == year)
  ))
)

const filterByRating = (rating, target) => (
  target.filter((movie) => (
    (+movie.rating >= rating)
  ))
)

const filterByGenres = filterBy('genres');
const filterByActors = filterBy('actors');
const filterByDirector = filterBy('director');

//const result = filterByYear(2002, movies);
//const result = filterByRating(9, movies);
//const result = filterByGenres('Sci-Fi', movies);
//const result = filterByActors('Christian Bale', movies);
//const result = filterByDirector('Christopher Nolan', movies);

//console.log(result.length)

exports.filterByYear = filterByYear;