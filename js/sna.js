const nodeWidth = 89;
const nodeHeight = 132;
const timer = 1000;
const minYear = 2000;
const maxYear = 2016;
const paradigms = [];
const posterScale = 1.5;
const collideGap = 1;
let nodeScale = 0.6;
let linkDistance = 250;
let nodeWidthRadius = nodeWidth * nodeScale / 2;
let nodeHeightRadius = nodeHeight * nodeScale / 2;

let svg;
let condition;
let graph;
let allMovies;
let allActors;
let fadeOutFlag;
let mode = '1mode';

const createCondition = () => {
  const searchCondition = {};
  const { actor, director, rating, genre, year } = condition

  if (actor && actor.length) {
    searchCondition.actor = actor;
  }

  if (director && director.length) {
    searchCondition.director = director;
  }

  if (rating > 6) {
    searchCondition.rating = rating;
  }

  if (genre && genre.length) {
    searchCondition.genre = genre;
  }

  if (year >= minYear && year <= maxYear) {
    searchCondition.year = year;
  }

  return searchCondition;
}

const searchAndReload = (condition) => {
  var result = filterBy(condition, allMovies);

  graph = (mode == '1mode')
    ? dataGenerator(result, allActors)
    : dataGenerator2mode(result, allActors);

  reload();
}

let width;
let height;
const reload = () => {
  if(svg)
    svg.remove();

  width = $(window).width() - svgLeft;
  height = $(window).height() - svgTop - svgBottom;

  svg = d3
    .selectAll(".svgContainer")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("top", svgTop)
    .style("left", svgLeft)
    .style("bottom", svgBottom)
    .style("right", svgRight);

  drawSNA(graph);
}

const applyConditionToUI = (condition) => {
  const { actor, director, rating, genre, year } = condition

  $("#actor").val(actor || '')
  $("#director").val(director || '')
  $("#year").val((year >= minYear && year <= maxYear) ? year : '?')
  $("#year").selectmenu("refresh");
  $("#genre").val(genre || '?')
  $("#genre").selectmenu("refresh");
  $("#ratingSlider").slider('value', (rating || 0) * 10);
}

const showCondition = () => {
  $("#condition").fadeIn();
  clearTimeout(fadeOutFlag)

  fadeOutFlag = setTimeout(() => {
    $("#condition").fadeOut("slow", () => {
      searchAndReload(createCondition());
    });
  }, timer);
}

const initModeCheckButton = () => {
  $(".common:checkbox").switchbutton({
    checkedLabel: '1 mode',
    uncheckedLabel: '2 mode'
  })
  .change(function(){
    mode = $(this).prop("checked") ? '1mode' : '2mode';
    $("#condition").text(`🖇 ${mode}`);
    showCondition();
  });;
}

const initYearOptions = () => {
  for(let year = maxYear ; year >= minYear ; year--) {
    $("#year").append($("<option></option>")
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
          'Horror', 'Music', 'Romance', 'Sci-Fi', 'Animation'];

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

const initSampleOptions = () => {
  const actors = ['Christian Bale', 'Tom Cruise', 'Robert Downey Jr.',
    'Daniel Radcliffe', 'Heath Ledger', 'Johnny Depp', 'Brad Pitt',
    'Daniel Craig', 'Angelina Jolie', 'Jennifer Lawrence', 'Emma Stone',
    'Eddie Murphy', 'Kevin Costner', 'Nicolas Cage'];

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
          'Horror', 'Music', 'Romance', 'Sci-Fi', 'Animation'];

  const rating = 8.0;

  actors.forEach((actor) => {
    paradigms.push({value: { actor: actor }, text: actor});
  });
  oscarsActors.forEach((actor) => {
    const info = actor.split('/');
    paradigms.push({value: { actor: info[0] }, text: `${info[0]} (${info[1]})`});
  });

  directors.forEach((director) => {
    paradigms.push({value: { director: director }, text: director});
  });
  oscarsDirectors.forEach((director) => {
    const info = director.split('/');
    paradigms.push({value: { director: info[0] }, text: `${info[0]} (${info[1]})`});
  });
  topGenre.forEach((genre) => {
    paradigms.push({value: { genre: genre, rating: rating }, text: `${genre} ${rating}+`});
  });

  for(let year = maxYear ; year >= minYear ; year--) {
    paradigms.push({value: { year: year, rating: rating }, text: `${year} ${rating}+`});
  }

  paradigms.forEach((paradigm) => {
    $('#paradigm').append($("<option></option>")
                  .attr("value", JSON.stringify(paradigm.value))
                  .text(paradigm.text));
  });

  $("#paradigm").val("");
  $("#paradigm").selectmenu({
    width: '60%',
    position: { my: "left bottom", at: "left top", collision: "none" }
  });

  $('#paradigm').on('selectmenuchange', function(){
    condition = Object.assign({
      actor: '',
      director: '',
      rating: 0,
      year: 0,
      genre: '',}, JSON.parse(this.value));
    applyConditionToUI(condition);
    searchAndReload(createCondition());
  });

  //random show paradigm
}

const initNodeSlider = () => {
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
}

const initLinkSlider = () => {
  $("#linkSlider").slider({
    value: linkDistance,
    min: 50,
    max: 600,
    slide: function(event, ui) {
      linkDistance = ui.value;
      reload();
    }
  });
}

const initRatingSlider = () => {
  $("#ratingSlider").slider({
    value: (condition.rating || 0) * 10,
    min: 60,
    max: 90,
    slide: function(event, ui) {
      condition.rating = ui.value / 10;
      $("#condition").text(`👍 ${condition.rating.toFixed(1)}`);
      showCondition();
    }
  });
}

const initActorInput = (availableActor) => {
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
}

const initDirectorInput = (availableDirector) => {
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
}

let svgTop;
let svgLeft;
let svgBottom;
let svgRight;
$(() => {
  svgTop = $('header').height()
    + Number($('header').css('padding-top').replace('px', ''))
    + Number($('header').css('padding-bottom').replace('px', ''));
  svgLeft = $('#resultInfo').width() - Number($('#resultInfo').css('left').replace('px', ''));
  svgBottom = $('footer').height()
    + Number($('footer').css('padding-top').replace('px', ''))
    + Number($('footer').css('padding-bottom').replace('px', ''));
  svgRight = 0;

  initSampleOptions();

  loadJSON(`./data/movies.json?${new Date().valueOf()}`, (movies) => {
    loadJSON(`./data/actors.json?${new Date().valueOf()}`, (actors) => {
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

      condition = paradigms[Math.floor(Math.random() * paradigms.length)].value;

      initModeCheckButton();
      initYearOptions();
      initGenreOptions();
      initNodeSlider();
      initLinkSlider();
      initRatingSlider();
      initActorInput(availableActor);
      initDirectorInput(availableDirector);

      applyConditionToUI(condition);
      searchAndReload(createCondition());
    });
  });
});

let gnode;
let links;
const drawSNA = (graph) => {
  var glinks = svg.append("g").attr("class", "links");

  links = glinks
    .selectAll()
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) {
        return d.value;
        //return Math.sqrt(d.value);
      });

  var gnodes = svg.append("g").attr("class", "nodes");

  var node = gnodes.selectAll("g.node").data(graph.nodes, function(d){
    return d.id;
  });

  gnode = node.enter().append("g")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  gnode.append("defs")
    .append("pattern")
      .attr("id", function(d){ return `image${d.id}`; } )
      .attr("patternUnits", "objectBoundingBox")
      .attr("width", "100%")
      .attr("height", "100%")
    .append("image")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", function(d) {
        return (nodeWidth * nodeScale * ((d.type === 'actor') ? 1 : posterScale)).toFixed(1);
      })
      .attr("height", function(d) {
        return (nodeHeight * nodeScale * ((d.type === 'actor') ? 1 : posterScale)).toFixed(1);
      })
      .attr("xlink:href", function(d){
        const photoPath = (d.type === 'actor') ? 'photos' : 'posters'
        return `./res/${photoPath}/${d.photo}`;
      });

  gnode.append("rect")
    .attr("width", function(d) {
      return (nodeWidth * nodeScale * ((d.type === 'actor') ? 1 : posterScale)).toFixed(1);
    })
    .attr("height", function(d) {
      return (nodeHeight * nodeScale * ((d.type === 'actor') ? 1 : posterScale)).toFixed(1);
    })
    .style("stroke-width", 4)
    .style("stroke", function(d) {
      return (d.type === 'actor') ? '#2196F3' : '#F44336';
    })
    .style("fill", function(d){
      return `url(#image${d.id})`;
    });

  gnode.append("text")
    .attr("dx", function(d) {
      return (nodeWidth * nodeScale * ((d.type === 'actor') ? 1 : posterScale) / 2).toFixed(1);
    })
    .attr("dy", function(d) {
      return (nodeHeight * nodeScale * ((d.type === 'actor') ? 1 : posterScale) + 20).toFixed(1);
    })
    .attr("text-anchor", "middle")
    .text(function(d) { return d.name; });

  gnode.append("title")
    .text(function(d) { return d.name; });

  var simulation = d3.forceSimulation()
    .force("link",
      d3.forceLink().distance(linkDistance * nodeScale).id(function(d) { return d.id; })
    )
    .force("collide", d3.forceCollide().radius(
      function(d) {
        return nodeWidth * nodeScale * ((d.type === 'actor') ? 1 : posterScale) + collideGap;
      }
    ).iterations(16))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(0))
    .force("y", d3.forceY(0))
    .on("tick", ticked);

  simulation
    .nodes(graph.nodes)
    .force("link")
    .links(graph.links);

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

function ticked() {
  links
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  //keep node in screen
  gnode
    .attr("transform", function(d) {
      d.x = Math.max(0,
        Math.min(width - nodeWidthRadius * 2, d.x - nodeWidthRadius)
      );
      d.y = Math.max(0,
        Math.min(height - nodeHeightRadius * 2, d.y - nodeHeightRadius)
      );
      return "translate(" + d.x + "," + d.y + ")";
  });
}