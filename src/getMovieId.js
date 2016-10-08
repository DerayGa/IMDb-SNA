/*
excute this code on imdb top page
ex: http://www.imdb.com/list/ls000344406/?start=2&view=compact&sort=listorian:asc&defaults=1&scb=0.26306029068746906
will get movie id on console
*/

var list = $('div.list.compact > table > tbody > tr.list_item > td.title > a');
var result = [];
list.each((index, value) => {
if(index > 99) return;
  result.push($(value).attr('href').split('/')[2]);
});
console.log(JSON.stringify(result));