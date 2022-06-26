const prompt = require('prompt-sync')();

const search = prompt('Press 1 for search with airport code, 2 for search with airport name: ');

if (search == 1) {
    const originAirportCode = prompt('Enter origin airport code: ');
    console.log(`origin airport code: ${originAirportCode}`);

    const destinationAirportCode = prompt('Enter destination airport code: ');
    console.log(`destination airport code: ${destinationAirportCode}`);
} else if (search == 2) {
    const originAirportName = prompt('Enter irigin airport name: ');
    console.log(`origin airport name: ${originAirportName}`);

    const destinationAirportName = prompt('Enter destination airport name: ');
    console.log(`destination airport name: ${destinationAirportName}`);
} else {
    console.log('God is a woman');
}

const departureDate = prompt('Enter departure date (dd.mm.yyyy): ');
console.log(`departure date:  ${departureDate}`);

const returnDate = prompt('Enter return date (dd.mm.yyyy): ');
console.log(`Return date: ${returnDate}`)


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