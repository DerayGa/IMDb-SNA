const nodeWidth = 89;
const nodeHeight = 132;
let svg;
let nodeScale = 0.7;
let linkDistance = 480;
let nodeWidthRadius = nodeWidth * nodeScale / 2;
let nodeHeightRadius = nodeHeight * nodeScale / 2;
const timer = 1000;

let condition = {
  actor: '',
  director: '',
  rating: 8,
  year: 2013,
  genre: '',
};


let graph;
let allMovies;
let allActors;

let fadeOutFlag;
const createCondition = () => {
  let searchCondition = {};
  const { actor, director, rating, genre, year } = condition
  if (actor.length) {
    searchCondition.actor = actor;
  }

  if (director.length) {
    searchCondition.director = director;
  }

  if (rating > 6) {
    searchCondition.rating = rating;
  }

  if (genre.length) {
    searchCondition.genre = genre;
  }

  if (year >= 2000 && year <= 2016) {
    searchCondition.year = year;
  }

  return searchCondition;
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

const applyConditionToUI = (condition) => {
  const { actor, director, rating, genre, year } = condition

  $("#actor").val(actor || '')
  $("#director").val(director || '')
  $("#year").val((year >= 2000 && year <= 2016) ? year : '?')
  $("#year").selectmenu("refresh");
  $("#genre").val(genre || '?')
  $("#genre").selectmenu("refresh");
  $("#ratingSlider").slider('value', rating * 10);
/*


  if (condition.rating > 6) {
    searchCondition.rating = condition.rating;
  }
*/
}

const showCondition = () => {
  $("#condition").fadeIn();
  clearTimeout(fadeOutFlag)

  fadeOutFlag = setTimeout(() => {
    $("#condition").fadeOut("slow");
    searchAndReload(createCondition());
  }, timer);
}

const initYearOptions = () => {
  for(let year = 2016 ; year >= 2000 ; year--) {
    $('#year').append($("<option></option>")
                .text(year));
  }

  $("#year").val(condition.year);
  $("#year").selectmenu({width: '60%'});
  $('#year').on('selectmenuchange', function(){
    $("#condition").text(`📅 ${this.value}`);
    condition.year = +this.value;
    showCondition();
  });
}

const initGenreOptions = () => {
  const genres = ['Action', 'Adventure', 'Biography',
          'Comedy', 'Crime', 'Fantasy', 'History',
          'Horror', 'Music', 'Romance', 'Sci-Fi'];

  genres.forEach((genre) => {
     $('#genre').append($("<option></option>")
                    .attr("value",genre)
                    .text(genre));

  });

  $("#genre").selectmenu({width: '60%'});
  $('#genre').on('selectmenuchange', function(){
    condition.genre = this.value;
    let symbol;
    switch (condition.genre){
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
        condition.genre = '';
        break;
    }

    $("#condition").text(symbol);
    showCondition();
  });
}

const initSampleptions = () => {
  const actors = ['Christian Bale', 'Tom Cruise', 'Robert Downey Jr.',
    'Daniel Radcliffe', 'Heath Ledger', 'Johnny Depp', 'Brad Pitt',
    'Angelina Jolie'];

  const oscarsActors = ['Russell Crowe/2000', 'Denzel Washington/2001',
    'Adrien Brody/2002', 'Sean Penn/2003, 2008', 'Jamie Foxx/2004',
    'Philip Seymour Hoffman/2005', 'Forest Whitaker/2006',
    'Daniel Day-Lewis/2007, 2012', 'Jeff Bridges/2009', 'Colin Firth/2010',
    'Jean Dujardin/2011', 'Matthew McConaughey/2013', 'Eddie Redmayne/2014',
    'Leonardo DiCaprio/2015'];

  const directors = ['Christopher Nolan' ];
  const oscarsDirectors = ['Steven Soderbergh/2000' ,'Ron Howard/2001',
    'Roman Polanski/2002', 'Peter Jackson/2003', 'Clint Eastwood/2004',
    'Ang Lee/2005, 2012', 'Martin Scorsese/2006', 'Joel Coen/2007',
    'Danny Boyle/2008', 'Kathryn Bigelow/2009', 'Tom Hooper/2010',
    'Michel Hazanavicius/2011', 'Alfonso Cuarón/2013',
    'Alejandro G. Iñárritu/2014, 2015'];

  const topGenre = ['Action', 'Adventure', 'Biography',
          'Comedy', 'Crime', 'Fantasy', 'History',
          'Horror', 'Music', 'Romance', 'Sci-Fi'];

  const samples = [];
  const rating = 8.0;

  actors.forEach((actor) => {
    samples.push({value: { actor: actor }, text: actor});
  });
  oscarsActors.forEach((actor) => {
    const info = actor.split('/');
    samples.push({value: { actor: info[0] }, text: `${info[0]} (${info[1]})`});
  });

  directors.forEach((director) => {
    samples.push({value: { director: director }, text: director});
  });
  oscarsDirectors.forEach((director) => {
    const info = director.split('/');
    samples.push({value: { director: info[0] }, text: `${info[0]} (${info[1]})`});
  });
  topGenre.forEach((genre) => {
    samples.push({value: { genre: genre, rating: rating }, text: `${genre} ${rating}+`});
  });

  for(let year = 2016 ; year >= 2000 ; year--) {
    samples.push({value: { year: year, rating: rating }, text: `${year} ${rating}+`});
  }

  samples.forEach((sample) => {
    $('#sample').append($("<option></option>")
                  .attr("value", JSON.stringify(sample.value))
                  .text(sample.text));
  });
  $("#sample").val("");
  $("#sample").selectmenu({
    width: '60%',
    position: { my: "left bottom", at: "left top", collision: "none" }
  });
  $('#sample').on('selectmenuchange', function(){
    condition = Object.assign({
      actor: '',
      director: '',
      rating: 0,
      year: 0,
      genre: '',}, JSON.parse(this.value));
    applyConditionToUI(condition);
    searchAndReload(createCondition());
    //$("#condition").text(`📅 ${this.value}`);
    //condition.year = +this.value;
    //showCondition();
  });
}

$(() => {
  initYearOptions();
  initGenreOptions();
  initSampleptions();

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
    value: condition.rating * 10,
    min: 60,
    max: 90,
    slide: function(event, ui) {
      condition.rating = ui.value / 10;
      $("#condition").text(`👍 ${condition.rating.toFixed(1)}`);
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
          condition.actor = ui.item.value;
          $("#condition").text(`🎭 ${condition.actor}`);
          showCondition();
          $(this).blur();
        },
        change: function( event, ui ) {
          if (!this.value.length) {
            condition.actor = '';
            $("#condition").text(`🎭 ?`);
            showCondition();
          }
        }
      });

      $("#director").autocomplete({
        source: availableDirector,
        minLength: 2,
        select: function(event, ui) {
          condition.director = ui.item.value;
          $("#condition").text(`🎥 ${condition.director}`);
          showCondition();
          $(this).blur();
        },
        change: function( event, ui ) {
          if (!this.value.length) {
            condition.director = '';
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