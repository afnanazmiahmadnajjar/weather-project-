const express = require("express");
const router = express.Router();
const moment = require("moment");
const City = require("../models/City");
const urllib = require("urllib");
const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather?q=";
const API_KEY = "665ed6305c92b30a4168b28f2519a1dd";
const IMAGE_URL = "http://openweathermap.org/img/w/";

router.get("/city/:cityName", async function (req, res) {
  try {
    let cityName = req.params.cityName;
    let final;
    let timeNow = moment().format("LTS");
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    const dommyCityData = await urllib.request(
      `${WEATHER_API}${cityName}&APPID=${API_KEY}`
    );
    const cityData = JSON.parse(dommyCityData.data);
    const foundedCity = await City.find({ name: cityName });
    if (foundedCity.length === 0) {
      let city = new City({
        name: cityData.name,
        temperature: Math.round(cityData.main.temp),
        condition: cityData.weather[0].description,
        conditionPic: `${IMAGE_URL}${cityData.weather[0].icon}.png`,
        isInDatabase: false,
        date: timeNow,
      });
      final = { status: cityData.cod, data: city };
    }
    res.send(final);
  } catch (err) {
    res.status(404).send("city not found");
  }
});
router.get("/cities", async function (req, res) {
  City.find({})
    .sort({ _id: -1 })
    .exec(function (err, cities) {
      res.send(cities);
    });
});

router.post("/city", async function (req, res) {
  let data = req.body;
  let citySaved = await City.find({ name: data.name });
  if (citySaved.length === 0) {
    let city = new City({
      name: data.name,
      temperature: data.temperature,
      condition: data.condition,
      conditionPic: data.conditionPic,
      isInDatabase: data.isInDatabase,
      date: data.date,
    });
    const citySavedPromise = city.save();
    citySavedPromise.then(function (citySaved) {
      if (citySaved != null)
        res.send(`The ${citySaved.name} city successfuly has been saved.`);
      else res.send(`Faield to save the ${cityName} city.`);
    });
  }
});

router.delete("/city/:cityName", function (req, res) {
  const cityName = req.params.cityName;
  const cityPromise = City.find({ name: cityName }, { _id: 1 });
  cityPromise.then(function (cityId) {
    const removedCity = City.deleteOne({ _id: cityId });
    removedCity.then(function (removed) {
      if (removed.deletedCount == 1) {
        res.send(`The ${cityName} city successfuly hase been removed.`);
      } else {
        res.send(`Faield to remove the ${cityName} city.`);
      }
    });
  });
});
router.put("/city/:cityName", async function (req, res) {
  let cityName = req.params.cityName;
  const dommyCityData = await urllib.request(
    `${WEATHER_API}${cityName}&APPID=${API_KEY}`
  );
  const cityData = JSON.parse(dommyCityData.data);
  let final = { code: 404, data: null };
  let c = await City.findOneAndDelete({ name: cityName });
  if (c !== null) {
    let timeNow = moment().format("LTS");
    let city = new City({
      name: cityData.name,
      temperature: Math.round(cityData.main.temp),
      condition: cityData.weather[0].description,
      conditionPic: `${IMAGE_URL}${cityData.weather[0].icon}.png`,
      isInDatabase: true,
      date: timeNow,
    });
    city.save();
    final = { status: cityData.cod, data: city };
  }
  res.send(final);
});
module.exports = router;
