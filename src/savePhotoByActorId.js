
const fs = require('fs');
const jsdom = require('jsdom');
var wget = require('wget');
const fetch = require('node-fetch');

const actors = require('../movies/actors.json').actors;

const rootDir = '../movies/';
const photoDir ='../res/photos/';
var count = actors.length;

actors.forEach((actor) => {
  actor.photo = '';
});

const checkCompleted = () => {
  if( count == 0) {
    console.log(`allActors with Photo Saved.`);
  } else {
    idx++;
    getPhotoById(actors[idx]);
  }
};

const getPhotoById = (actor) => {
  if (actor.photo) {
    console.log(actor.name, ' -> ', actor.photo);
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
          actor.photo = $('img#name-poster').attr('src');
          if (actor.photo) {
            console.log('found! ', actor.name);
            wget.download(actor.photo, `${photoDir}${actor.id}.jpg`); 
            
          } else {
            console.log('NOT found! ', actor.name);
          }
          count--;

          checkCompleted();
        }
      )
    });
};

var idx = 0;
getPhotoById(actors[idx]);
