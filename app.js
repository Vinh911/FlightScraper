const prompt = require('prompt-sync')();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');

const skyscanner_url = 'https://www.skyscanner.de';

const search = prompt('Press 1 for search with airport code, 2 for search with airport name: ');
let originAirportCode = '';
let destinationAirportCode = '';
let originAirportName = '';
let destinationAirportName = '';

if (search == 1) {
    originAirportCode = prompt('Enter origin airport code: ');
    destinationAirportCode = prompt('Enter destination airport code: ');
} else if (search == 2) {
    originAirportName = prompt('Enter irigin airport name: ');
    destinationAirportName = prompt('Enter destination airport name: ');
} else {
    console.log('God is a woman');
}

let departureDate = prompt('Enter departure date (dd.mm.yyyy): ');
let returnDate = prompt('Enter return date (dd.mm.yyyy): ');

if (checkDate(departureDate) && checkDate(returnDate) && returnDate > departureDate) {
    if (search == 1) {
        console.log('Origin: ' + originAirportCode + ' Destination: ' + destinationAirportCode + '\nDeparture: ' + departureDate + ' Return: ' + returnDate);
    } else if (search == 2) {
        console.log('Origin: ' + originAirportName + ' Destination: ' + destinationAirportName + '\nDeparture: ' + departureDate + ' Return: ' + returnDate);
    }

    departureDate = formatDate(departureDate);
    returnDate = formatDate(returnDate);
} else {
    console.log('Invalid date');
    process.exit();
}

function checkDate(date) {
    if (date.length != 10) {
        return false;
    }

    const dateArray = date.split('.');
    const day = dateArray[0];
    const month = dateArray[1];
    const year = dateArray[2];

    if (day < 1 || day > 31 || day === undefined) {
        return false;
    }
    if (month < 1 || month > 12 || month === undefined) {
        return false;
    }
    if (year < 0 || year > 9999 || year === undefined) {
        return false;
    }
    return true;
}

function formatDate(date) {
    const dateArray = date.split('.');
    const day = dateArray[0];
    const month = dateArray[1];
    const year = dateArray[2].slice(-2);

    return `${year}${month}${day}`;
}

puppeteer.use(StealthPlugin());

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