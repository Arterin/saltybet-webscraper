// noinspection JSUnusedLocalSymbols,SpellCheckingInspection

const cheerio = require('cheerio');
const axios = require('axios');

function scrapeSaltybet() {

    // Get saltybet html.
    axios.get('https://www.saltybet.com/shaker').then((response) => {
        // Load html into cheerio.
        const html = cheerio.load(response.data);
        // Get tournament countdown text from the div.
        let saltyText = html("#compendiumleft > div");
        saltyText = saltyText.text();
        // Format text.
        saltyText = saltyText.trimLeft();
        const lastExclamation = saltyText.indexOf('!') + 1;
        saltyText = saltyText.slice(0, lastExclamation);
        console.log(saltyText);
        // TODO Add tweet function and call it here with saltyText as input.
    })
    // TODO Add fail case.
    // TODO Add timeout fail case.
}

scrapeSaltybet();