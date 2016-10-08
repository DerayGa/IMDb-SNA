// http://www.imdb.com/find?q=A.D.%20Miles&s=nm
const jsdom = require('jsdom');
const fs = require('fs');
const fetch = require('node-fetch');
const actors = require('../movies/actors.json').actors;

const rootDir = '../movies/';
var count = actors.length;

const saveToJSON = () => {
  fs.writeFile(`${rootDir}actors.json`,
    JSON.stringify({ actors: actors }, null, 2), (err) => {
    if (err) {
      return console.error(err);
    }
  });
};

const checkCompleted = () => {
  if( count == 0) {
    saveToJSON();
    console.log(`allActors with Id Saved.`);
  } else {
    idx++;
    getIdByName(actors[idx]);
  }
};

const getIdByName = (actor) => {
  if (actor.id) {
    console.log(actor.name, ' -> ', actor.id);
    count--;
    checkCompleted();
    return;
  }
  //const url = `http://www.imdb.com/find?q=${actor.name}&s=nm`;
  //const url = `http://m.imdb.com/find?q=${actor.name}`;
  const url = `http://www.imdb.com/xml/find?json=1&nr=1&nm=on&q=${actor.name}`;
  fetch(url)
    .then((res) => (
      res.json()
    )).then((json) => {
      if (json.name_exact) {
        json.name_exact.forEach((obj) => {
          if (obj.name == actor.name) {
            actor.id = obj.id;
          }
        });
      }
      if (json.name_approx && !actor.id) {
        json.name_approx.forEach((obj) => {
          if (obj.name == actor.name) {
            actor.id = obj.id;
          }
        });
      }
      if (json.name_popular && !actor.id) {
        json.name_popular.forEach((obj) => {
          if (obj.name == actor.name) {
            actor.id = obj.id;
          }
        });
      }

      if (actor.id) {
        console.log('found! ', actor.name, actor.id);
        
        saveToJSON();
      } else {
        console.log('NOT found! ', actor.name);
      }
      count--;

      checkCompleted();
    });
};


var idx = 0;
getIdByName(actors[idx]);
