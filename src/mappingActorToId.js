// http://www.imdb.com/find?q=A.D.%20Miles&s=nm
const jsdom = require('jsdom');
const fs = require('fs');
const fetch = require('node-fetch');
const actors = require('../movies/actors.json').actors;

const rootDir = '../movies/';
var count = actors.length;

const isAlphaOrParen = (str) => {
  return /^[A-Za-z ]+$/.test(str);
}

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
    //console.log(actor.name, ' -> ', actor.id);
    count--;
    checkCompleted();
    return;
  }
  if (!isAlphaOrParen(actor.name)) {
    var url = `http://m.imdb.com/find?q=${encodeURI(actor.name)}`;

    fetch(url)
      .then((res) => (
        res.text()
      )).then((body) => {
        jsdom.env(
          body,
          ["http://code.jquery.com/jquery.js"],
          (err, window) => {
            const $ = window.$
            const result = $('section.posters > div.poster > div.label > div.title > a');
            result.each((index, node) => {
              if($(node).text() == actor.name){
                actor.id = $(node).attr('href').split('/')[2];
                return false;
              }
            });

            if (actor.id) {
              console.log('found! ', actor.name, actor.id);
              
              saveToJSON();
            } else {
              console.log('NOT found! ', actor.name);
            }
            count--;

            checkCompleted();
          }
        )
      });
  } else {
    var url = `http://www.imdb.com/xml/find?json=1&nr=1&nm=on&q=${actor.name}`;

    fetch(url)
      .then((res) => (
        res.json()
      )).then((json) => {
        const compareFromArray = (array) => {
          array.forEach((obj) => {
            if (obj.name == actor.name) {
              actor.id = obj.id;
            }
          });
          if (!actor.id && array.length) {
            console.log('=============guess=============');
            actor.id = array[0].id;
            console.log(actor.name, array[0].name)
            console.log('===============================');
          }
        }
        if (json.name_exact) {
          compareFromArray(json.name_exact);
        }
        if (json.name_approx && !actor.id) {
          compareFromArray(json.name_approx);
        }
        if (json.name_popular && !actor.id) {
          compareFromArray(json.name_popular);
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
  }
};


var idx = 0;
getIdByName(actors[idx]);
