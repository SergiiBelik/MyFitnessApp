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
mongoose.connect('mongodb://localhost/my_fitness_app')


app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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

app.get("/myhomepage", isLoggedIn, function(req, res){
    User.findOne(req.user).populate('products').exec((err, user) => {
        if(err){
            console.log(err)
        } else {
            res.render('myHomePage.ejs', {user: user})
            console.log(user)
        }
    })
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

app.post('/myhomepage_breakfast', isLoggedIn, (req, res) => {
    const ndbno = req.body.add
    const url = 'https://api.nal.usda.gov/ndb/reports/?ndbno=' + ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    request(url, (error, response, body) => {
      if(!error && response.statusCode == 200){
          const data = JSON.parse(body)
          data.report.when = 'breakfast'
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
                            res.redirect('/breakfast' )
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
    const url = 'https://api.nal.usda.gov/ndb/reports/?ndbno=' + ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    request(url, (error, response, body) => {
      if(!error && response.statusCode == 200){
          const data = JSON.parse(body)
          data.report.when = 'lunch'
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
                            res.redirect('/lunch' )
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
    const url = 'https://api.nal.usda.gov/ndb/reports/?ndbno=' + ndbno + '&format=json&api_key=FlFZ5TIYS2lxli2VllGPoiJXRCvvj9OQ0RMit78F'
    request(url, (error, response, body) => {
      if(!error && response.statusCode == 200){
          const data = JSON.parse(body)
          data.report.when = 'dinner'
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
                            res.redirect('/dinner' )
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

app.get('/breakfast', isLoggedIn, (req, res) => {
    res.render('search_breakfast.ejs')
})

app.get('/lunch', isLoggedIn, (req, res) => {
    res.render('search_lunch.ejs')
})

app.get('/dinner', isLoggedIn, (req, res) => {
    res.render('search_dinner.ejs')
})

// app.get('/productsAdded', (req, res) => {
//     res.render('productsAdded.ejs')
// })

app.get('/results_breakfast', isLoggedIn, (req, res) => {
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
                res.render('search_breakfast.ejs', {items: response})
                }, (error) => {
                    console.log(error)
                })
        }
    })
    }
})

app.get('/results_lunch', isLoggedIn, (req, res) => {
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
                res.render('search_lunch.ejs', {items: response})
                }, (error) => {
                    console.log(error)
                })
        }
    })
    }
})

app.get('/results_dinner', isLoggedIn, (req, res) => {
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
                res.render('search_dinner.ejs', {items: response})
                }, (error) => {
                    console.log(error)
                })
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
    
app.listen(process.env.PORT, process.env.IP, () => console.log('Fitness app has been started!'))