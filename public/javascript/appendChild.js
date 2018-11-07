const appendChild = () => {
// Access some stored data
  let ndbno = localStorage.getItem('ndbno')
  fetch('https://api.nal.usda.gov/ndb/reports/?ndbno=' + ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F')
    .then((response) => {
      return response.json()
    })
    .then((myJson) => {
                
           myJson["report"]["food"]["nutrients"].forEach(function(nutrient){
             let li = document.createElement('li')
             li.innerHTML = nutrient.name
             document.body.appendChild(li)
             
            //     <p id="nutrname"><%= nutrient.name %></p> - 
            //     <span id="nutrmeasure"><%= nutrient.value %><%= nutrient.unit %></span>
            //     <% nutrient["measures"].forEach(function(measure){ %>
            //     <span><%= measure.value%><%= measure.eunit%></span>
            //     <% }) %>
            // </div>
            })
    })
}
appendChild()


