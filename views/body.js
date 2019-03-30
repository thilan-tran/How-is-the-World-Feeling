// const axios = require('axios');
// const cheerio = require('cheerio');

const app = document.getElementById('root')
const container = document.createElement('div')
container.setAttribute('class', 'container')
app.appendChild(container)

var request = new XMLHttpRequest()
request.open('GET', 'https://cors.io?https://us-central1-vision-migration.cloudfunctions.net/la_hacks_2019?market_code=1', true)

request.onload = function () {
  var data = JSON.parse(this.response)

  console.log('here')
  console.log(data.buckets[0].report.rollups[0].name)

  data.buckets[0].report.rollups.forEach(item => {
    console.log(item.name)
    const card = document.createElement('div')
    card.setAttribute('class','card')
    const h1 = document.createElement('h1')
    h1.textContent = item.name
    const a = document.createElement('a')
    var obj = item.top_articles_on_network[0]
    var keys = Object.keys(obj)
    var vals = Object.values(obj)
    a.textContent = vals
    a.href = keys
    container.appendChild(card)
    card.appendChild(h1)
    card.appendChild(a)
  })
}

request.send()

// var request2 = new XMLHttpRequest()
// request2.open('GET','https://cors.io?https://www.thecut.com/2019/03/an-awkward-kiss-changed-how-i-saw-joe-biden.html',true)
// request2.onload = function () {
//   var doc = this.reponse
//   console.log(doc)
// }
// request2.send()
