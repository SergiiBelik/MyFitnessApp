const appendChild = () => {
// Access some stored data
  let ndbno = localStorage.getItem('ndbno')
  fetch('https://api.nal.usda.gov/ndb/reports/?ndbno=' + ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F')
    .then((response) => {
      return response.json()
    })
    .then((myJson) => {
      myJson.report.food.nutrients.forEach((nutrient) => {
        let li = document.createElement('li')
        li.innerHTML = nutrient.name + ' ' + nutrient.value
        document.getElementById('products').appendChild(li)
      })
    })
}
appendChild()


