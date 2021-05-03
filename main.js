// noinspection JSUnusedLocalSymbols,SpellCheckingInspection,JSVoidFunctionReturnValueUsed

const cheerio = require('cheerio');
const axios = require('axios');
const twit = require('twit');
const keys = require('./keys');

const T = new twit(keys);

let tweetLimiter = 0;
const status = "Saltybet tournament starting in two matches!"

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
        if(result === "2 more matches until the next tournament!" && tweetLimiter === 0) {
            // Get current date and time, I live in UTC+12 so I have formatted the string to reflect that.
            // TODO make this look not so hideous :)
            const date = new Date().toUTCString();
            let post = status + " " + date;
            post.replace("GMT", "UTC+12")
            // Post to twitter.
            T.post('statuses/update', {status: post}, tweeted);
            // Stop more tweets until after the tournament.
            tweetLimiter = 1;
        }

        if(result.includes("exhibition")) {
            // Allow Tweets again.
            tweetLimiter = 0;
        }
    })
}

function tweeted(err, data, response) {
    if(err) {
        console.log("error: ", err.stack);
    } else {
        console.log(data);
    }
}

// Call saltyPost() every 45 seconds.
setInterval(saltyPost, 1000*45);
