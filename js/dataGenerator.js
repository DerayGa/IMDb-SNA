"use strict";

const dataGenerator = (movies, allActors) => {
  if (movies.length > 100) {
      $("#condition").text(`Too many movies!`);
      showCondition(false);
      movies.length = 100;
  }

  var actors = [];

  const graph = {
    nodes: [],
    links: []
  };

  //console.log('Movie:', movies.length);

  //change actors from string to array
  movies.forEach((movie, index) => {
    if(typeof movie.actors == 'string') {
      movie.actors = movie.actors.split(',').map((actor) => (
        actor.trim()
      ));
    }

    movie.actors.forEach((actor) => {
      if (actors.indexOf(actor) < 0) {
        actors.push(actor);
      }
    });
  });

  actors.sort();
  allActors.forEach((actor) => {
    actor.photo = (actor.photo == 'noPhoto.jpg') ? null : actor.photo;
  });

  const findActorByName = (name) => (
    allActors.filter((actor) => (actor.name == name))[0]
  )
  actors = actors.map(findActorByName);

  actors.forEach((actor) => {
    //ignore those who have no photo(sorry~)
    if (!actor.photo) return;

    graph.nodes.push({
      id: actor.id,
      name: actor.name,
      photo: actor.photo,
      group: 0,
    });
  });
  //console.log('Actors:', graph.nodes.length);

  movies.forEach((movie, index) => {
    movie.actors.forEach((sourceName) => {
      const source = findActorByName(sourceName);
      if (!source.photo)
        return;

      movie.actors.forEach((targetName) => {
        const target = findActorByName(targetName);
        if (!target.photo)
          return;

        if (source.id == target.id)
          return;

        var link = graph.links.filter((link) => (
          (
            ( link.source == source.id && link.target == target.id) || 
            ( link.source == target.id && link.target == source.id)
          )
        ))[0];
        if (!link) {
          link = { source: source.id, target: target.id, value: 0};
          graph.links.push(link);
        }

        link.value = (link.value) ? link.value*2 : 1;
      });
    });
  });
  //console.log('Links:', graph.links.length);

  $("#resultInfo").text(`
🎬
${movies.length}

🎭
${graph.nodes.length}

🔗
${graph.links.length}`);

  return graph;
}

this.dataGenerator = dataGenerator;
