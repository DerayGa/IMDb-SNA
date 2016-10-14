"use strict";

const filterByKey = (key) => (value, target) => (
  target.filter((movie) => (
    (movie[key].indexOf(value) > -1)
  ))
);

const filterByYear = (year, target) => (
  target.filter((movie) => (
    (movie.year == year)
  ))
);

const filterByRating = (rating, target) => (
  target.filter((movie) => (
    (+movie.rating >= rating)
  ))
);

const filterByGenre = filterByKey('genres');
const filterByActor = filterByKey('actors');
const filterByDirector = filterByKey('director');

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const filterBy = (condition, target) => {
  const keys = Object.keys(condition);
  let result = target;

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
