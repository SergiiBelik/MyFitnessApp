const express = require('express')
const app = express()
const request = require("request");
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require("passport")
const localStrategy = require("passport-local")
const passportLocalMongoose = require('passport-local-mongoose')
const Product = require('./models/product.js')
const User = require('./models/user.js')
const combinePromises = require('./models/combinePromises.js')
const flatpickr = require('flatpickr')
const methodOverride = require('method-override')
mongoose.connect('mongodb://localhost/my_fitness_app')


app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'stay healthy',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            console.log(err)
            return res.render('register.ejs')
        }
        passport.authenticate('local')(req, res, () => {
                res.redirect('/myhomepage')
            })
    })
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/myhomepage',
    failureRedirect: '/login'
}), (req, res) => {
})

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

app.get("/myhomepage", isLoggedIn, function(req, res){
    let day
    if(typeof(req.query.calendar) == 'undefined'){
        day = new Date().toLocaleDateString()
    } else {
        day = req.query.calendar
    }
    User.findOne(req.user).populate('products').exec((err, user) => {
        if(err){
            console.log(err)
        } else {
            res.render('myHomePage.ejs', {user: user, day: day})
            // console.log(user)
        }
    })
})

app.delete('/myhomepage', isLoggedIn, function(req, res){
    Product.findByIdAndRemove(req.body.remove, (err) => {
        if(err){
            res.redirect('back')
        } else {
            res.redirect('back')
        }
    })
})

app.post('/myhomepage_breakfast', isLoggedIn, (req, res) => {
    const ndbno = req.body.add
    const date = req.body.date
    const url = 'https://api.nal.usda.gov/ndb/reports/?ndbno=' + ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    
    request(url, (error, response, body) => {
      if(!error && response.statusCode == 200){
          const data = JSON.parse(body)
          data.report.when = 'breakfast'
          if(typeof(date) == 'undefined'){
            data.report.date = new Date().toLocaleDateString()
            } else {
                data.report.date = date
            }       
    
          data.report.amount = req.body.amount
          data.report.measure = req.body.measure

          Product.create(data, (err, product) => {
              User.findOne(req.user, (err, user) => {
                if(err){
                    console.log(err)
                } else {
                    user.products.push(product)
                    user.save((err, data) => {
                        if(err){
                            console.log(err)
                        } else {
                            res.render('search_breakfast.ejs', {date: date} )
                            // console.log(data)
                        }
                    })
                    }
              })
          })
      } else {
          console.log(error)
      }

    })
})

app.post('/myhomepage_lunch', isLoggedIn, (req, res) => {
    const ndbno = req.body.add
    const date = req.body.date
    const url = 'https://api.nal.usda.gov/ndb/reports/?ndbno=' + ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    request(url, (error, response, body) => {
      if(!error && response.statusCode == 200){
          const data = JSON.parse(body)
          data.report.when = 'lunch'
            if(typeof(date) == 'undefined'){
                data.report.date = new Date().toLocaleDateString()
            } else {
                data.report.date = date
            } 
          data.report.amount = req.body.amount
          data.report.measure = req.body.measure
          
          Product.create(data, (err, product) => {
              User.findOne(req.user, (err, user) => {
                if(err){
                    console.log(err)
                } else {
                    user.products.push(product)
                    user.save((err, data) => {
                        if(err){
                            console.log(err)
                        } else {
                            res.render('search_lunch.ejs', {date: date} )
                            // console.log(data)
                        }
                    })
                    }
              })
          })
      } else {
          console.log(error)
      }

    })
})

app.post('/myhomepage_dinner', isLoggedIn, (req, res) => {
    const ndbno = req.body.add
    const date = req.body.date
    const amount = req.body.amount
    const measure = req.body.measure
    const user = req.user
    const dinner = 'dinner'
    addProductToTheDB(dinner, ndbno, date, amount, measure, user, res)
})

app.get('/breakfast', isLoggedIn, (req, res) => {
    let date = req.query.date
    res.render('search_breakfast.ejs', {date: date})
})

app.get('/lunch', isLoggedIn, (req, res) => {
    let date = req.query.date
    res.render('search_lunch.ejs', {date: date})
})

app.get('/dinner', isLoggedIn, (req, res) => {
    let date = req.query.date
    res.render('search_dinner.ejs', {date: date})
})

app.get('/results_breakfast', isLoggedIn, (req, res) => {
    const query = req.query.product
    const date = req.query.date
    let items = []
    let urlList = []
    let firstURL = 'https://api.nal.usda.gov/ndb/search/?format=json&q='+query+'&ds=Standard%20Reference&sort=n&max=25&offset=0&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    if(typeof(req.query.product) != 'undefined'){
        request(firstURL, (error, response, body) => {
            if(!error && response.statusCode == 200){
                const data = JSON.parse(body)
                if(data.errors && data.errors.error != 'undefined'){
                    res.render('productNotFound.ejs', {data: data, redirect: '/breakfast'})
                } else {
                //for each product lookup nutrition data
                for(let i = 0; i < data['list']['item'].length; i++){
                    urlList.push('https://api.nal.usda.gov/ndb/reports/?ndbno=' + data['list']['item'][i].ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F')
                }
            combinePromises(urlList)//running API requests using URLs from firstURL array and creating new array from resulting objects
            .then((response) => {//once array of resulting objects is ready we render this array to results.ejs file
                res.render('search_breakfast.ejs', {items: response, date: date})
                }, (error) => {
                    console.log(error)
                })
        }
      }
    })
    }
})

app.get('/results_lunch', isLoggedIn, (req, res) => {
    const query = req.query.product
    const date = req.query.date
    let items = []
    let urlList = []
    let firstURL = 'https://api.nal.usda.gov/ndb/search/?format=json&q='+query+'&ds=Standard%20Reference&sort=n&max=25&offset=0&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    if(typeof(req.query.product) != 'undefined'){
        request(firstURL, (error, response, body) => {
            if(!error && response.statusCode == 200){
                const data = JSON.parse(body)
                if(data.errors && data.errors.error != 'undefined'){
                    res.render('productNotFound.ejs', {data: data, redirect: '/lunch'})
                }else{
                     //for each product lookup nutrition data
                     for(let i = 0; i < data['list']['item'].length; i++){
                        urlList.push('https://api.nal.usda.gov/ndb/reports/?ndbno=' + data['list']['item'][i].ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F')
                    }
            combinePromises(urlList)//running API requests using URLs from firstURL array and creating new array from resulting objects
            .then((response) => {//once array of resulting objects is ready we render this array to results.ejs file
                res.render('search_lunch.ejs', {items: response, date: date})
                }, (error) => {
                    console.log(error)
                })
        }
      }
    })
    }
})

app.get('/results_dinner', isLoggedIn, (req, res) => {
    const query = req.query.product
    const date = req.query.date
    let items = []
    let urlList = []
    let firstURL = 'https://api.nal.usda.gov/ndb/search/?format=json&q='+query+'&ds=Standard%20Reference&sort=n&max=25&offset=0&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    if(typeof(req.query.product) != 'undefined'){
    request(firstURL, (error, response, body) => {
      if(!error && response.statusCode == 200){
        const data = JSON.parse(body)
        if(data.errors && data.errors.error != 'undefined'){
            res.render('productNotFound.ejs', {data: data, redirect: '/dinner'})
        } else {
        //for each product lookup nutrition data
        for(let i = 0; i < data['list']['item'].length; i++){
          urlList.push('https://api.nal.usda.gov/ndb/reports/?ndbno=' + data['list']['item'][i].ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F')
        }
        combinePromises(urlList)//running API requests using URLs from firstURL array and creating new array from resulting objects
            .then((response) => {//once array of resulting objects is ready we render this array to results.ejs file
                res.render('search_dinner.ejs', {items: response, date: date})
                }, (error) => {
                    console.log(error)
                })
        }
      }
    })
    }
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function addProductToTheDB(when, ndbno, date, amount, measure, user, res){
    const url = 'https://api.nal.usda.gov/ndb/reports/?ndbno=' + ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    request(url, (error, response, body) => {
      if(!error && response.statusCode == 200){
          const data = JSON.parse(body)
          data.report.when = when
                  if(typeof(date) == 'undefined'){
            data.report.date = new Date().toLocaleDateString()
            } else {
                data.report.date = date
            } 
          data.report.amount = amount
          data.report.measure = measure
          Product.create(data, (err, product) => {
              User.findOne(user, (err, user) => {
                if(err){
                    console.log(err)
                } else {
                    user.products.push(product)
                    console.log(user)
                    user.save((err, data) => {
                        if(err){
                            console.log(err)
                        } else {
                            console.log('2  ' + data)
                            res.render('search_' + when+'.ejs', {date: date} )
                            // console.log(data)
                        }
                    })
                    }
              })
          })
      } else {
          console.log(error)
      }

    })
}
    
app.listen(process.env.PORT, process.env.IP, () => console.log('Fitness app has been started!'))