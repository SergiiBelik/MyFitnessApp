const express = require('express')
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
//var Promise = require("bluebird");
//var request = Promise.promisifyAll(require("request"), {multiArgs: true});
app.use(express.static('public'))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support

app.get("/", function(req, res){
    // console.log(req.query.product)
    if(typeof(req.query.product) != 'undefined'){
    const query = req.query.product
    let items = []
    let urlList = []
    let firstURL = 'https://api.nal.usda.gov/ndb/search/?format=json&q='+query+'&ds=Standard%20Reference&sort=n&max=25&offset=0&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    
    request(firstURL, (error, response, body) => {
         if(!error && response.statusCode == 200){
            const data = JSON.parse(body)
             //for each product lookup nutrition data
             for(let i = 0; i < data['list']['item'].length; i++){
                urlList.push('https://api.nal.usda.gov/ndb/reports/?ndbno=' + data['list']['item'][i].ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F')
            }

            combinePromises(urlList)//running API requests using URLs from firstURL array and creating new array from resulting objects
                .then((response) => {//once array of resulting objects is ready we render this array to results.ejs file
                    res.render('home.ejs', {items: response})
                }, (error) => {
                    console.log(error)
                })
        }
    })

        const combinePromises = (context) => {
        return Promise.all(
            context.map((url) => {  
            return new Promise((resolve, reject) => {    
              try{
                request({
                  url: url,
                }, (err, response, body) => {
                  if(err){
                    reject(err);
                  }else{
                    context = JSON.parse(body)
                    resolve(context)
                  }
                })     
              }catch(error){
                reject(error);
              }    
            })
          })
        )
      }
}else{
        res.render('home.ejs')
}
})


app.get("/search", function(req, res){
   res.render("search.ejs");
});

app.get("/test", function(req, res){
   res.render("test.ejs");
});

app.get('/results', (req, res) => {
    const query = req.query.product
    let items = []
    let urlList = []
    let firstURL = 'https://api.nal.usda.gov/ndb/search/?format=json&q='+query+'&ds=Standard%20Reference&sort=n&max=25&offset=0&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    
    request(firstURL, (error, response, body) => {
         if(!error && response.statusCode == 200){
            const data = JSON.parse(body)
             //for each product lookup nutrition data
             for(let i = 0; i < data['list']['item'].length; i++){
                urlList.push('https://api.nal.usda.gov/ndb/reports/?ndbno=' + data['list']['item'][i].ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F')
            }

            combinePromises(urlList)//running API requests using URLs from firstURL array and creating new array from resulting objects
                .then((response) => {//once array of resulting objects is ready we render this array to results.ejs file
                    res.render('results.ejs', {items: response})
                }, (error) => {
                    console.log(error)
                })
        }
    })

        const combinePromises = (context) => {
        return Promise.all(
            context.map((url) => {  
            return new Promise((resolve, reject) => {    
              try{
                request({
                  url: url,
                }, (err, response, body) => {
                  if(err){
                    reject(err);
                  }else{
                    context = JSON.parse(body)
                    resolve(context)
                  }
                })     
              }catch(error){
                reject(error);
              }    
            })
          })
        )
      }

})
    
app.listen(process.env.PORT, process.env.IP, () => console.log('Fitness app has been started!'))