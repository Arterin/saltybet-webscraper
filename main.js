// noinspection JSUnusedLocalSymbols,SpellCheckingInspection,JSVoidFunctionReturnValueUsed

const cheerio = require('cheerio');
const axios = require('axios');
const twit = require('twit');
const keys = require('./keys');

const T = new twit(keys)

async function scrapeSaltybet() {
    // Get saltybet html.
    let response = await axios.get('https://www.saltybet.com/shaker');
    // Load html into cheerio.
    const html = cheerio.load(response.data);
    // Get tournament countdown text from the div.
    let saltyText = html("#compendiumleft > div");
    saltyText = saltyText.text();
    // Format text.
    saltyText = saltyText.trimLeft();
    const lastExclamation = saltyText.indexOf('!') + 1;
    saltyText = saltyText.slice(0, lastExclamation);
    return saltyText;
// TODO Add fail case.
// TODO Add timeout fail case.
}

function saltyPost() {
    // Get tournament string from saltybet.
    scrapeSaltybet().then(function(result) {
        if(result === "The current game mode is: matchmaking. Tournament mode will be activated after the next match!") {
            // Post to twitter
            T.post('statuses/update', {status: 'Saltybet tournament starting now!'}, tweeted);
        }
    })
}

function tweeted(err, data, response) {
    if(err) {
        console.log("error!", err.stack);
    } else {
        console.log(data);
    }
}
saltyPost();
setInterval(saltyPost, 1000*60);
