const express = require("express");
const https = require("https");
const bodyParser = require("body-parser")
const apikeys = require('./apikeys');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {
    const query = req.body.cityName;

const apiKey = apikeys.apiKey;
const unit = "metric";
const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey + "&lang=en";

    https.get(url, function(response) {
        console.log(response.statusCode);

        if (response.statusCode === 404) {
            res.redirect("/error.html");
            return;
        }

        response.on("data", function (data) {

            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<p><h2>The weather is currently " + description + "</h2></p>");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celsius.</h1>");
            res.write("<img src=" + imageUrl + " ></img>");

            res.send();

        });
    });
});


app.listen(3000, function() {
    console.log("The server is running on port 3000.");
})