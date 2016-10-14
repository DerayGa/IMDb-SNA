const nodeWidth = 89;
const nodeHeight = 132;
let svg;
let nodeScale = 0.7;
let linkDistance = 480;
let nodeWidthRadius = nodeWidth * nodeScale / 2;
let nodeHeightRadius = nodeHeight * nodeScale / 2;
const timer = 1000;

let actor = '';
let year = 2016;
let genre = '';
let director = '';
let rating = 8;
let condition;
let graph;
let allMovies;
let allActors;

let fadeOutFlag;
const createCondition = () => {
  condition = {};

  if (actor.length) {
    condition.actor = actor;
  }

  if (director.length) {
    condition.director = director;
  }

  if (rating > 6) {
    condition.rating = rating;
  }

  if (genre.length) {
    condition.genre = genre;
  }

  if (year >= 2000 && year <= 2016) {
    condition.year = year;
  }

  //console.log(condition);

  return condition;
}

const searchAndReload = (condition) => {
  var result = filterBy(condition, allMovies);

  graph = dataGenerator(result, allActors);
  reload();
}
const reload = () => {
  if(svg)
    svg.remove();

  svg = d3.selectAll("body").append("svg");

  drawSNA(graph);
}

const showCondition = () => {
  $("#condition").fadeIn();
  clearTimeout(fadeOutFlag)

  fadeOutFlag = setTimeout(() => {
    $("#condition").fadeOut("slow");
    searchAndReload(createCondition());
  }, timer);
}
$( function() {

  $("#year").selectmenu({width: '60%'});
  $('#year').on('selectmenuchange', function(){
    year = this.value;
    $("#condition").text(`📅 ${year}`);
    year = +year;
    showCondition();
  });

  $("#genre").selectmenu({width: '60%'});
  $('#genre').on('selectmenuchange', function(){
    genre = this.value;
    let symbol;
    switch (genre){
      case 'Action':
        symbol = '💥';
        break;

      case 'Adventure':
        symbol = '🌏';
        break;

      case 'Biography':
        symbol = '📜';
        break;

      case 'Comedy':
        symbol = '😃';
        break;

      case 'Crime':
        symbol = '💣';
        break;

      case 'Fantasy':
        symbol = '💫';
        break;

      case 'History':
        symbol = '💬';
        break;

      case 'Horror':
        symbol = '😱';
        break;

      case 'Music':
        symbol = '🎶';
        break;

      case 'Romance':
        symbol = '💋';
        break;

      case 'Sci-Fi':
        symbol = '👽';
        break;

      default:
        symbol = '?'
        break;
    }

    if (symbol == '?') {
      genre = '';
    }

    $("#condition").text(symbol);
    showCondition();
  });
  $("#nodeSlider").slider({
    value: nodeScale * 10,
    min: 1,
    max: 10,
    slide: function(event, ui) {
      nodeScale = ui.value / 10.0;
      nodeWidthRadius = nodeWidth * nodeScale / 2;
      nodeHeightRadius = nodeHeight * nodeScale / 2;
      reload();
    }
  });
  $("#linkSlider").slider({
    value: linkDistance,
    min: 50,
    max: 600,
    slide: function(event, ui) {
      linkDistance = ui.value;
      reload();
    }
  });
  $("#ratingSlider").slider({
    value: rating * 10,
    min: 60,
    max: 90,
    slide: function(event, ui) {
      rating = ui.value / 10;
      $("#condition").text(`👍 ${rating.toFixed(1)}`);
      showCondition();
    }
  });

  loadJSON('./data/movies.json', (movies) => {
    loadJSON('./data/actors.json', (actors) => {
      allMovies = movies;
      allActors = actors.actors;

      const availableActor = allActors
        .filter((actor) => (actor.photo != 'noPhoto.jpg'))
        .map((actor) => (actor.name));

      const availableDirector = [];
      allMovies.map((movie) => (movie.director.split(',')))
       .forEach((directories) => {
          directories.forEach((director) => {
            if (availableDirector.indexOf(director) < 0) {
              availableDirector.push(director);
            }
          });
       })
       availableDirector.sort();

      $("#actor").autocomplete({
        source: availableActor,
        minLength: 2,
        select: function(event, ui) {
          actor = ui.item.value;
          $("#condition").text(`🎭 ${actor}`);
          showCondition();
          $(this).blur();
        },
        change: function( event, ui ) {
          if (!this.value.length) {
            actor = '';
            $("#condition").text(`🎭 ?`);
            showCondition();
          }
        }
      });

      $("#director").autocomplete({
        source: availableDirector,
        minLength: 2,
        select: function(event, ui) {
          director = ui.item.value;
          $("#condition").text(`🎥 ${director}`);
          showCondition();
          $(this).blur();
        },
        change: function( event, ui ) {
          if (!this.value.length) {
            director = '';
            $("#condition").text(`🎥 ?`);
            showCondition();
          }
        }
      });

      searchAndReload(createCondition());
    });
  });
});

const drawSNA = (graph) => {

  var width = $(window).width();
  var height = $(window).height();

  svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height);

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var simulation = d3.forceSimulation()
      .force("link",
        d3.forceLink().distance(linkDistance * nodeScale).id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().distanceMin(25).strength(-60))
      .force("center", d3.forceCenter(width / 2, height / 2))

  var glinks = svg.append("g")
      .attr("class", "links");

  var links = glinks.selectAll()
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) {
        return d.value;
        //return Math.sqrt(d.value);
      });

  var gnodes = svg.append("g")
      .attr("class", "nodes");

  var node = gnodes.selectAll("g.node").data(graph.nodes, function(d){ return d.id; });

  var gnode = node.enter().append("svg")
      .attr("width", nodeWidth * nodeScale)
      .attr("height", nodeHeight * nodeScale)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  gnode.append("defs")
      .append("pattern")
        .attr("id", function(d){ return "image"+d.id; } )
        .attr("patternUnits", "objectBoundingBox")
        .attr("width", "100%")
        .attr("height", "100%")
      .append("image")
        .attr("width", nodeWidth * nodeScale)
        .attr("height", nodeHeight * nodeScale)
        .attr("xlink:href", function(d){ return "./res/photos/"+d.photo; } )

  /*gnode.append("circle")
        .attr("r", 25)
        .attr("cx", 25)
        .attr("cy", 25)
        .style("fill", function(d){ return "url(#image"+d.id+")"; } )*/
  gnode.append("rect")
        .attr("width", nodeWidth * nodeScale)
        .attr("height", nodeHeight * nodeScale)
        .style("fill", function(d){ return "url(#image"+d.id+")"; } )
      //.attr("fill", function(d) { return color(d.group); })

  /*gnode.append("image")
    .attr("x", "10")
    .attr("y", "3")
    .attr("width", "30")
    .attr("height", "44")
    .attr("xlink:href", function(d){ return "./res/photos/"+d.photo; } );*/

  gnode.append("title")
      .text(function(d) { return d.name; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    gnode
        .attr("x", function(d) {
          //return d.x - nodeWidthRadius;
          return d.x = Math.max(0,
            Math.min(width - nodeWidthRadius * 2, d.x - nodeWidthRadius));
        })
        .attr("y", function(d) {
          //return d.y - nodeHeightRadius;
          return d.y = Math.max(55,
            Math.min(height - nodeHeightRadius * 3, d.y - nodeHeightRadius) );
        });
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x + nodeWidthRadius;
    d.fy = d.y + nodeHeightRadius;
  }

  function dragged(d) {
    d.fx = d3.event.x + nodeWidthRadius;
    d.fy = d3.event.y + nodeHeightRadius;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}