// http://www.imdb.com/find?q=A.D.%20Miles&s=nm
const fs = require('fs');
const jsdom = require('jsdom');
const fetch = require('node-fetch');
const decoder = require('./convertAllEscapes.js');
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
  if (!actor) return;
  if (actor.id) {
    //console.log(actor.name, ' -> ', actor.id);
    count--;
    checkCompleted();
    return;
  }
  const isActorOrActress = (description) => {
    const desc = description.toLowerCase();
    return (desc.indexOf('actor') > -1 || desc.indexOf('actress') > -1);
  }

  const compareFromArray = (array, guess) => {
    array.forEach((obj) => {
      if (!actor.id
        && decoder.convertAllEscapes(obj.name) == actor.name
        && isActorOrActress(obj.description)) {
        actor.id = obj.id; //find first and stop
      }
    });
    if (!actor.id && array.length && guess) {
      console.log('=============guess=============');
      actor.id = array[0].id;
      console.log(actor.name, ' -> ', decoder.convertAllEscapes((array[0].name)))
      console.log('===============================');
    }
  }

  var url = `http://www.imdb.com/xml/find?json=1&nr=1&nm=on&q=${actor.name}`;
  fetch(url)
    .then((res) => (
      res.json()
    )).then((json) => {
      if (json.name_popular && !actor.id) {
        compareFromArray(json.name_popular);
      }

      if (json.name_exact && !actor.id) {
        compareFromArray(json.name_exact);
      }

      if (json.name_approx && !actor.id) {
        compareFromArray(json.name_approx);
      }

      if (json.name_popular && !actor.id) {
        compareFromArray(json.name_popular, true);
      }

      if (json.name_exact && !actor.id) {
        compareFromArray(json.name_exact, true);
      }

      if (json.name_approx && !actor.id) {
        compareFromArray(json.name_approx, true);
      }

      if (actor.id) {
        console.log('found! ', actor.name, actor.id, `#${idx}`);
        
        saveToJSON();
      } else {
        console.log('NOT found! ', actor.name, `#${idx}`);
      }
      count--;

      checkCompleted();
    });
};

var idx = 0;
getIdByName(actors[idx]);
getIdByName(actors[++idx]);
getIdByName(actors[++idx]);
getIdByName(actors[++idx]);
getIdByName(actors[++idx]);