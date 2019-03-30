console.log('here');
const axios = require('axios');
const cheerio = require('cheerio');


// const url = 'https://www.msn.com/en-us/news/world/trump-cuts-all-direct-assistance-to-honduras-el-salvador-guatemala/ar-BBVpDf5'
const url = 'https://www.thecut.com/2019/03/an-awkward-kiss-changed-how-i-saw-joe-biden.html'
// const url = 'https://news.ycombinator.com';
// const url = 'https://en.wikipedia.org/wiki/George_Washington';

// let getData = html => {
//   data = [];
//   const $ = cheerio.load(html);
//   $('table.itemlist tr td:nth-child(3)').each((i, elem) => {
//     data.push({
//       title : $(elem).text(),
//       link : $(elem).find('a.storylink').attr('href')
//     });
//   });
//   console.log(data)
// }


axios.get(url)
  .then(response => {
    // console.log(response.data);
    // console.log(cheerio('.firstHeading', response.data).text());
    // console.log(cheerio('.bday', response.data).text());
    console.log(cheerio('p', response.data).text());
  })
  .catch(error => {
    console.log(error);
  })
