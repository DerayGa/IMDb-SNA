"use strict";

const filterByKey = (key) => (value, movies) => (
  movies.filter((movie) => (
    (movie[key].indexOf(value) > -1)
  ))
);

const filterByYear = (year, movies) => (
  movies.filter((movie) => (
    (movie.year == year)
  ))
);

const filterByRating = (rating, movies) => (
  movies.filter((movie) => (
    (+movie.rating >= rating)
  ))
);

const filterByGenre = filterByKey('genres');
const filterByActor = filterByKey('actors');
const filterByDirector = filterByKey('director');

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const filterBy = (condition, movies) => {
  const keys = Object.keys(condition);
  let result = movies.slice();

  keys.forEach((key) => {
    result = this['filterBy' + capitalize(key)](condition[key], result);
  });

  return result;
};

this.filterBy = filterBy;
this.filterByYear = filterByYear;
this.filterByRating = filterByRating;
this.filterByGenre = filterByGenre;
this.filterByActor = filterByActor;
this.filterByDirector = filterByDirector;
