const express = require('express')
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/my_fitness_app')
var passport = require("passport");
var LocalStrategy = require("passport-local")
const Product = require('./models/product.js')
const combinePromises = require('./models/combinePromises.js')

//var Promise = require("bluebird");
//var request = Promise.promisifyAll(require("request"), {multiArgs: true});
app.use(express.static('public'))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support

app.get("/", function(req, res){
    Product.find({}, (err, products) =>{
        if(err){
            console.log(err)
        } else {
            res.render('home.ejs', {products: products})
        }
    })
})

app.post('/', (req, res) => {
    const ndbno = req.body.add
    const url = 'https://api.nal.usda.gov/ndb/reports/?ndbno=' + ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    request(url, (error, response, body) => {
      if(!error && response.statusCode == 200){
          const data = JSON.parse(body)
          Product.create(data, (err, data) => {
            if(err){
                console.log(err)
            } else {
                res.redirect('/productsAdded')
            }
            })
      } else {
          console.log(error)
      }

    })
})

app.get('/search', (req, res) => {
    res.render('search.ejs')
})

app.get('/productsAdded', (req, res) => {
    res.render('productsAdded.ejs')
})

app.get('/results', (req, res) => {
    const query = req.query.product
    let items = []
    let urlList = []
    let firstURL = 'https://api.nal.usda.gov/ndb/search/?format=json&q='+query+'&ds=Standard%20Reference&sort=n&max=25&offset=0&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    if(typeof(req.query.product) != 'undefined'){
    request(firstURL, (error, response, body) => {
      if(!error && response.statusCode == 200){
        const data = JSON.parse(body)
        //for each product lookup nutrition data
        for(let i = 0; i < data['list']['item'].length; i++){
          urlList.push('https://api.nal.usda.gov/ndb/reports/?ndbno=' + data['list']['item'][i].ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F')
        }
        combinePromises(urlList)//running API requests using URLs from firstURL array and creating new array from resulting objects
            .then((response) => {//once array of resulting objects is ready we render this array to results.ejs file
                res.render('search.ejs', {items: response})
                }, (error) => {
                    console.log(error)
                })
        }
    })
    }
})
    
app.listen(process.env.PORT, process.env.IP, () => console.log('Fitness app has been started!'))