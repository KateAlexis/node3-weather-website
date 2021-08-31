const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express();
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather References",
    name: "Katy Santos",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "folklore",
    name: "Taylor Swift",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address!'
    })
  }

  geocode(req.query.address, (error, {latitude, longitude, location} ={})=>  {
    if (error)  {
      return res.send({error})
    }

    forecast(latitude, longitude, (error, forecastData)=>  {
      if(error) {
        return res.send({error})
      }
      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })

  // res.send({
  //   forecast: "It is snowing",
  //   location: "Philadelphia",
  //   address: req.query.address
  // });
});

app.get('/products', (req,res)=>{
  if (!req.query.search)  {
    return res.send({
      error: 'You must provide a searh term.'
    })
  }

  console.log(req.query.search);
  res.send({
    products:[]
  })
})

app.get("/help", (req, res) => {
  res.render("help", {
    helpMsg: "These are frequently asked questions.",
    title: "Help!",
    name: "Bambam",
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMsg: "Help article not found...",
    title: "Error 404",
    name: "Bambam",
  })
});

app.get("*", (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Harold',
    errorMsg: "Sorry, page not found!"
  });
});

app.listen(port, () => {
  console.log("Server is up on port port" +port +".");
});
