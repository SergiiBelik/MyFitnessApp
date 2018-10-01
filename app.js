var express = require("express");
var app = express();
var request = require("request");


app.get("/", function(req, res){
   res.render("home.ejs");
});

app.get("/search", function(req, res){
   res.render("search.ejs");
});

app.get("/results", function(req, res){
    var query = req.query.product;
    var items = [];
    //find the list of products by name
    request('https://api.nal.usda.gov/ndb/search/?format=json&q='+query+'&ds=Standard%20Reference&sort=n&max=25&offset=0&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F', function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            //for each product lookup nutrition data
            for(var i = 0; i < data["list"]["item"].length; i++){
                request('https://api.nal.usda.gov/ndb/reports/?ndbno=' + data["list"]["item"][i].ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F', function(err, resp, body2){
                    if(!err && resp.statusCode == 200){
                        var nutritionData = JSON.parse(body2);
                        //add nutrition data object to the array
                        items[i] = nutritionData;
                        //console.log(items[i]);
                    }
                });
            }
            console.log(items.length); //this prints out 0. I need somehow to fill items array with the data from second API and 
                                        //then render it to my results.ejs file
            //render("results.ejs", {items: items});
        }
    });
});

    
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Fitness app has been started!");
});