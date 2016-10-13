const loadJSON = (json, callback) => {
  fetch(`${json}`).then((response) => (
    response.json()
  )).then((json) => {
    return callback(json);
  });
}

this.loadJSON = loadJSON;