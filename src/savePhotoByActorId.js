
const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const request = require('request');
const fetch = require('node-fetch');

const actors = require('../data/actors.json').actors;

const rootDir = '../data/';
const photoDir ='../res/photos/';
var count = actors.length;

actors.forEach((actor) => {
  actor.photo = '';
});

const photoList = fs.readdirSync(photoDir)
  .filter((name) => {
    const filename = path.join(photoDir, name);
    const stats = fs.statSync(filename);

    return (stats.isFile() && path.extname(filename) === '.jpg');
  }).map((name) => (name.replace('.jpg', '')));

const checkCompleted = () => {
  if( count == 0) {
    console.log(`allActors with Photo Saved.`);
  } else {
    idx++;
    getPhotoById(actors[idx]);
  }
};

const download = (uri, filename, callback) => {
  request.head(uri, (err, res, body) => {
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

const getPhotoById = (actor) => {
  if (!actor) return;
  if (photoList.indexOf(actor.id) > 0) {
    //console.log(actor.name, 'photo existed');
    count--;
    checkCompleted();
    return;
  }
  var photoUrl = `http://m.imdb.com/name/${actor.id}/`;
  fetch(photoUrl)
    .then((res) => (
      res.text()
    )).then((body) => {
      jsdom.env(
        body,
        ["http://code.jquery.com/jquery.js"],
        (err, window) => {
          const $ = window.$;
          const imgSrc = $('img#name-poster').attr('src');
          if (imgSrc) {
            download(imgSrc, `${photoDir}${actor.id}.jpg`, () => {
              console.log('found! ', actor.name, `#${idx}`);
              count--;

              checkCompleted();
            });

          } else {
            console.log('NOT found! ', actor.name, `#${idx}`);
            count--;

            checkCompleted();
          }
        }
      )
    });
};

var idx = 0;
getPhotoById(actors[idx]);
getPhotoById(actors[++idx]);
getPhotoById(actors[++idx]);
getPhotoById(actors[++idx]);
