const loadJSON = (json, callback) => {
  fetch(`../movies/${json}`).then((response) => (
    response.json()
  )).then((json) => {
    return callback(json);
  });
}

this.loadJSON = loadJSON;