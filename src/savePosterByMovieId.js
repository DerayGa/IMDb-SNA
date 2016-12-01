
const fs = require('fs');
const request = require('request');
const path = require('path');
const jsdom = require('jsdom');
const fetch = require('node-fetch');

const movies = require('../data/movies.json');

const rootDir = '../data/';
const posterDir ='../res/posters/';
var count = movies.length;

const posterList = fs.readdirSync(posterDir)
  .filter((name) => {
    const filename = path.join(posterDir, name);
    const stats = fs.statSync(filename);

    return (stats.isFile() && path.extname(filename) === '.jpg');
  }).map((name) => (name.replace('.jpg', '')));

//--
/*
const saveToJSON = () => {
  fs.writeFile(`${rootDir}movies.json`,
    JSON.stringify(movies, null, 2), (err) => {
    if (err) {
      return console.error(err);
    }
  });
};


movies.forEach((movie) => {
  let poster = 'noPoster.jpg';
  if (posterList.indexOf(movie.imdbid) > 0) {
    poster = `${movie.imdbid}.jpg`;
  } else {
    console.log('poster not found', movie.title, movie.imdbid);
  }

  movie.photo = poster;
});
saveToJSON();

return;*/
//--

const checkCompleted = () => {
  if( count == 0) {
    console.log(`allMovies with Poster Saved.`);
  } else {
    idx++;
    getPosterById(movies[idx]);
  }
};

const download = (uri, filename, callback) => {
  request.head(uri, (err, res, body) => {
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

const getPosterById = (movie) => {
  if (!movie) return;
  if (posterList.indexOf(movie.imdbid) > 0) {
    //console.log(movie.name, 'photo existed');
    count--;
    checkCompleted();
    return;
  }

  if (movie.poster.indexOf('http') == 0) {
    download(movie.poster, `${posterDir}${movie.imdbid}.jpg`, () => {
      console.log('save! ', movie.title, `#${idx}`);
      count--;

      checkCompleted();
    });
  } else {
    //parse poster from web
    var posterUrl = `http://www.imdb.com/title/${movie.imdbid}/`;
    fetch(posterUrl)
        .then((res) => (
          res.text()
        )).then((body) => {
          jsdom.env(
            body,
            ["http://code.jquery.com/jquery.js"],
            (err, window) => {
              const $ = window.$;
              const imgSrc = $('div.poster img').attr('src');
              if (imgSrc) {
                download(imgSrc, `${posterDir}${movie.imdbid}.jpg`, () => {
                  console.log('found! ', movie.title, `#${idx}`);
                  count--;

                  checkCompleted();
                });

              } else {
                console.log('NOT found! ', movie.title, `#${idx}`);
                count--;

                checkCompleted();
              }
            }
          )
        });
  }
};

var idx = 0;
getPosterById(movies[idx]);
getPosterById(movies[++idx]);
getPosterById(movies[++idx]);
getPosterById(movies[++idx]);
