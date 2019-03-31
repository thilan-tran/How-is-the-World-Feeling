const language = require("@google-cloud/language");
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const LOCATION = [
  "the United States",
  "Great Britain",
  "India",
  "Australia",
  "Israel",
  "Germany",
  "Mexico",
  "Japan",
  "Korea",
  "France"
];
console.log("here");

app.use(express.static("public"));
app.set("view engine", "ejs");

router.get("/:p/data/:id", function(req, res) {
  let myData = null;
  let apiUrl =
    "https://us-central1-vision-migration.cloudfunctions.net/la_hacks_2019?market_code=";

  apiUrl += req.params.p;
  axios.get(apiUrl).then(response => {
    myData = response.data;
    var array = [];
    response.data.buckets[0].report.rollups[
      req.params.id
    ].top_articles_on_network.forEach(item => {
      if (
        array.findIndex(
          obj => Object.values(obj).toString() == Object.values(item).toString()
        ) == -1
      )
        array.push(item);
    });
    var loc = response.data.views[req.params.p];
    promises = [];
    sa_promises = [];
    e_promises = [];
    se_promises = [];

    console.log("creating url array");
    response.data.buckets[0].report.rollups[
      req.params.id
    ].top_articles_on_network.forEach(item => {
      const url = Object.keys(item);
      promises.push(axios.get(url[0]));
    });

    console.log("creating analysis arrays");
    axios.all(promises).then(results => {
      results.forEach(response => {
        const client = new language.LanguageServiceClient();
        const text = cheerio("p", response.data).text();
        const document = {
          content: text,
          type: "PLAIN_TEXT"
        };
        sa_promises.push(client.analyzeSentiment({ document: document }));
        e_promises.push(client.analyzeEntities({ document }));
        se_promises.push(client.analyzeEntitySentiment({ document: document }));
      });
      var sentiment = getStuff(sa_promises, res, 
          {data:array, loc:LOCATION[req.params.p], l:req.params.p});
      var entity = getMoreStuff(e_promises);
      var entitysentiment = getEvenMoreStuff(se_promises);
  //    console.log("cleaning up the output");
//      var data = makeStuffCoherent(entity, entitysentiment);
      /* res.render("detail", {
        data: array,
        avg: sentiment,
        loc: LOCATION[req.params.p],
        l: req.params.p
      }); */
    });

    //console.log(myData);
  });
  //display the specific articles for a trending topic

  //display the result of google cloud analysis of this topic.
});

function getStuff(sa_promises, res, resObject) {
  console.log("about to execute sa analysis");
  Promise.all(sa_promises)
    .then(allResults => {
      var total = 0,
        counter = 0;
      console.log("executing analysis array of size: " + allResults.length);
      allResults.forEach(resultArr => {
        const sentiment = resultArr[0].documentSentiment;
        total += sentiment.score;
        counter++;
        console.log(`Sentiment score: ${sentiment.score}`);
        console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
      });
      var sentiment = (total/counter).toFixed(3);
      console.log("average: " + total / counter);
      res.render("detail", Object.assign(resObject, { avg: sentiment }));
      return sentiment;
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
}

function getMoreStuff(e_promises) {
  console.log("about to execute entity analysis");
  var array = [];
  Promise.all(e_promises)
    .then(allResults => {
      console.log("performing entity analysis for " + allResults.length);
      allResults.forEach(resultArr => {
        const entities = resultArr[0].entities;
        var website = [];
        var l = entities.length > 10 ? 10 : entities.length;
        for (var i = 0; i < l; i++) {
          var entity = entities[i];
          console.log("Entity name: " + entity.name);
          console.log("Entity type: " + entity.type);
          console.log("Entity Salience: " + entity.salience);
          var myEntity = {
            name: entity.name,
            type: entity.type,
            salience: entity.salience
          };
          website.push(myEntity);
        }
        array.push(website);
        console.log("finished a website!");
      });
      return array;
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
}

function getEvenMoreStuff(se_promises) {
  console.log("about to execute sentiment entity analysis");
  var array = [];
  Promise.all(se_promises)
    .then(allResults => {
      console.log("sentiment entity analysis for " + allResults.length);
      allResults.forEach(resultArr => {
        const entities = resultArr[0].entities;
        var website = [];
        var l = entities.length > 10 ? 10 : entities.length;
        for (var i = 0; i < l; i++) {
          var entity = entities[i];
          console.log("Entity name: " + entity.name);
          console.log("Entity type: " + entity.type);
          console.log("Sentiment score: " + entity.sentiment.score);
          console.log("Sentiment magnitude: " + entity.sentiment.magnitude);
          var myEntity = {
            name: entity.name,
            type: entity.type,
            score: entity.sentiment.score,
            magnitude: entity.sentiment.magnitude
          };
          website.push(myEntity);
        }
        array.push(website);
        console.log("finished a website!");
      });
      return array;
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
}

function makeStuffCoherent(entity, entitysentiment) {
  if (entity.length != entitysentiment.length)
    console.log("oopsies! your arrays are not of the same size.");
  return;
  var data = [];
  for (var i = 0; i < entity.length; i++) {
    if (entity[i].length != entitysentiment[i].length)
      console.log("oopsies! your arrays are not of the same size.");
    var website = [];
    for (var j = 0; j < entity[i].length; j++){
      var object = Object.assign(entity[i][j], entitysentiment[i][j]);
      website.push(object);
    }
    data.push(website);
  }
  console.log(data.length == entity.length);
  return data;
}

router.get("/:id?", function(req, res) {

  let myData = null;
  var locate = 0;
  let apiUrl =
    "https://us-central1-vision-migration.cloudfunctions.net/la_hacks_2019?market_code=";
  if (req.params.id != null) {
    apiUrl += req.params.id;
    locate = req.params.id;
  } else apiUrl += 0;
  axios
    .get(apiUrl)
    .then(response => {
      myData = response.data;
      console.log(response.data);
      response.data.buckets[0].report.rollups.forEach(item => {
        console.log(item.name);
      });
      res.render("index", {
        data: response.data.buckets[0].report.rollups,
        loc: LOCATION[locate],
        l: locate
      });
      console.log(myData);
    })
    .catch(error => {
      console.log(error);
    });

  if (myData != null) console.log(myData);
});

//add the router
app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at Port 3000");

