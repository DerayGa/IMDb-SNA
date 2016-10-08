// http://www.imdb.com/find?q=A.D.%20Miles&s=nm
const jsdom = require('jsdom');
const fs = require('fs');
const fetch = require('node-fetch');
const actors = require('../movies/actors.json').actors;

const rootDir = '../movies/';
var count = actors.length;

const checkCompleted = () => {
  if( count == 0) {
    fs.writeFile(`${rootDir}actors.json`,
      JSON.stringify({ actors: actors }, null, 2), (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(`allActors with Id Saved.`);
    });
  }
};

actors.forEach((actor, index) => {
  if(actor.id) {
    count--;
    checkCompleted();
    return;
  }
  const url = `http://www.imdb.com/find?q=${actor.name}&s=nm`;
  fetch(url)
    .then((res) => (
      res.text()
    )).then((body) => {
      jsdom.env(
        body,
        ["http://code.jquery.com/jquery.js"],
        (err, window) => {
          const $ = window.$
          const result = $('table.findList > tbody > tr > td.result_text > a');
          result.each((index, node) => {
            if($(node).text() == actor.name){
              actor.id = $(node).attr('href').split('/')[2];
              return false;
            }
          });

          if (actor.id) {
            console.log('found! ', actor.name, actor.id);
          } else {
            console.log('NOT found! ', actor.name, actor.id);
          }
          count--;

          checkCompleted();
        }
      );
    });
});
