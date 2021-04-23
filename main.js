const cheerio = require('cheerio');
const axios = require('axios');

function scrapeSaltybet() {
    // get saltybet html
    axios.get('https://www.saltybet.com/shaker').then((response) => {
        // load html into cheerio
        const $ = cheerio.load(response.data);
        // get div I want
        let div = $("#compendiumleft > div");
        div = div.text();
        div = div.trimLeft();
        let lastExclamation = div.indexOf('!') + 1;
        div = div.slice(0, lastExclamation);
        console.log(div);
    })
}

scrapeSaltybet()
