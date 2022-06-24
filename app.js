// const airport_code = '';
// const airport_name = '';

// function askQuestion(question) {
//     const readline = require('readline');
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });

//     return new Promise(resolve => rl.question(question, answer => {
//         rl.close();
//         resolve(answer);
//     }));
// }

// const ans = await askQuestion('What is the airport code? ');



const skyscanner_url = 'https://www.skyscanner.de';

const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdBlockerPlugin({ blockTrackers: true }));

puppeteer.launch({ headless: true }).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 })

    //accept cookies
    await page.goto(skyscanner_url);
    await page.click('#acceptCookieButton');
    console.log('clicked accept cookie button');

    //paste origin and destination
    await page.click('#fsc-origin-search');
    await page.keyboard.type('Berlin');
    await page.keyboard.press('Enter');

    await page.click('#fsc-destination-search');
    await page.keyboard.type('London');
    await page.keyboard.press('Enter');

    await page.screenshot({ path: 'screenshot.png' });

    await browser.close()
});