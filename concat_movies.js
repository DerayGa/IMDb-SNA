"use strict";

const fs = require('fs');
const path = require('path');

const rootDir = './movies/';
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
  
  allMovies.push(JSON.parse(fs.readFileSync(filename, 'utf8')));  
});

fs.writeFile(`${rootDir}movies.json`,
  JSON.stringify(allMovies, null, 2), (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`allMovies Saved.`);
});