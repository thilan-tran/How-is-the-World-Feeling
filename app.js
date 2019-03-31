const language = require("@google-cloud/language");
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
console.log("here");

app.use(express.static("public"));
app.set("view engine", "ejs");

router.get("/data/:id", function(req, res) {
  let myData = null;
  const apiUrl =
    "https://us-central1-vision-migration.cloudfunctions.net/la_hacks_2019?market_code=1";
  axios.get(apiUrl).then(response => {
    myData = response.data;
    console.log(response.data);
    response.data.buckets[0].report.rollups.forEach(item => {
      console.log(item.name);
    });
    var array = [];
    response.data.buckets[0].report.rollups[
      req.params.id
    ].top_articles_on_network.forEach(item => {
      if ( array.findIndex(obj => Object.values(obj).toString() == Object.values(item).toString()) == -1)
        array.push(item);
    });

    promises = [];

    response.data.buckets[0].report.rollups[
      req.params.id
    ].top_articles_on_network.forEach(item => {
      const url = Object.keys(item);
      promises.push(axios.get(url[0]));
    });

    axios.all(promises).then(results =>
      results.forEach(response => {
        const client = new language.LanguageServiceClient();
        const text = cheerio("p", response.data).text();
        const document = {
          content: text,
          type: "PLAIN_TEXT"
        };
        client
          .analyzeSentiment({ document: document })
          .then(results => {
            const sentiment = results[0].documentSentiment;

            // console.log(`Text: ${text}`);
            console.log(`Sentiment score: ${sentiment.score}`);
            console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
          })
          .catch(err => {
            console.error("ERROR:", err);
          });
        // cheerio("p", response.data).text();
      })
    );
    res.render("detail", { data: array });
    //console.log(myData);
  });
  //display the specific articles for a trending topic

  //display the result of google cloud analysis of this topic.
});

function getStuff(url) {
  axios
    .get(url)
    .then(response => {
      //console.log(cheerio("p", response.data).text());
      return cheerio("p", response.data).text();
    })
    .catch(error => {
      console.log(error);
    });
}

router.get("/:id?", function(req, res) {
  const url =
    "https://www.thecut.com/2019/03/an-awkward-kiss-changed-how-i-saw-joe-biden.html";
  axios
    .get(url)
    .then(response => {
      // console.log(response.data);
      // console.log(cheerio('p', response.data).text());
    })
    .catch(error => {
      console.log(error);
    });

  // res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
  // const axios = require('axios');
  // const cheerio = require('cheerio');

  //   const app = document.getElementById('root')
  //   const container = document.createElement('div')
  //   container.setAttribute('class', 'container')
  //   app.appendChild(container)

  //   var request = new XMLHttpRequest()

  // <!-- <% data.forEach(function(data){ %> -->
  // <!-- <% }) %> -->
  // request.open('GET', 'https://cors.io?https://us-central1-vision-migration.cloudfunctions.net/la_hacks_2019?market_code=0', true)
  let myData = null;
  let apiUrl =
    "https://us-central1-vision-migration.cloudfunctions.net/la_hacks_2019?market_code=";
    if(req.params.id != null)
        apiUrl+=req.params.id;
    else
        apiUrl+=0;
  axios
    .get(apiUrl)
    .then(response => {
      myData = response.data;
      console.log(response.data);
      response.data.buckets[0].report.rollups.forEach(item => {
        console.log(item.name);
      });
      res.render("index", { data: response.data.buckets[0].report.rollups });
      console.log(myData);
    })
    .catch(error => {
      console.log(error);
    });

  //   const https = require('https');
  // request.onload = function () {
  //   var data = JSON.parse(this.response)

  //   console.log('here')
  //   console.log(data.buckets[0].report.rollups[0].name)

  //   data.buckets[0].report.rollups.forEach(item => {
  //     console.log(item.name)
  //     const card = document.createElement('div')
  //     card.setAttribute('class','card')
  //     const h1 = document.createElement('h1')
  //     h1.textContent = item.name
  //     const a = document.createElement('a')
  //     var obj = item.top_articles_on_network[0]
  //     var keys = Object.keys(obj)
  //     var vals = Object.values(obj)
  //     a.textContent = vals
  //     a.href = keys
  //     container.appendChild(card)
  //     card.appendChild(h1)
  //     card.appendChild(a)
  //   })
  // }

  // request.send()

  // var request2 = new XMLHttpRequest()
  // request2.open('GET','https://cors.io?https://www.thecut.com/2019/03/an-awkward-kiss-changed-how-i-saw-joe-biden.html',true)
  // request2.onload = function () {
  //   var doc = this.reponse
  //   console.log(doc)
  // }
  // request2.send()

  // res.render('index');
  if (myData != null) console.log(myData);
});

//add the router
app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at Port 3000");

//     <script type="text/javascript">
//     // const axios = require('axios');
//   // const cheerio = require('cheerio');

//   const app = document.getElementById('root')
//   const container = document.createElement('div')
//   container.setAttribute('class', 'container')
//   app.appendChild(container)

//   var request = new XMLHttpRequest()
// request.open('GET', 'https://cors.io?https://us-central1-vision-migration.cloudfunctions.net/la_hacks_2019?market_code=0', true)

// request.onload = function () {
//   var data = JSON.parse(this.response)

//   console.log('here')
//   console.log(data.buckets[0].report.rollups[0].name)

//   data.buckets[0].report.rollups.forEach(item => {
//     console.log(item.name)
//     const card = document.createElement('div')
//     card.setAttribute('class','card')
//     const h1 = document.createElement('h1')
//     h1.textContent = item.name
//     const a = document.createElement('a')
//     var obj = item.top_articles_on_network[0]
//     var keys = Object.keys(obj)
//     var vals = Object.values(obj)
//     a.textContent = vals
//     a.href = keys
//     container.appendChild(card)
//     card.appendChild(h1)
//     card.appendChild(a)
//   })
// }

// request.send()

// // var request2 = new XMLHttpRequest()
// // request2.open('GET','https://cors.io?https://www.thecut.com/2019/03/an-awkward-kiss-changed-how-i-saw-joe-biden.html',true)
// // request2.onload = function () {
// //   var doc = this.reponse
// //   console.log(doc)
// // }
// // request2.send()

//     </script>
