const prompt = require('prompt-sync')();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');

const skyscanner_url = 'https://www.skyscanner.de/transport/fluge/';

let originAirport = '';
let destinationAirport = '';
let departureDate = '';
let returnDate = '';

getUserInput();
searchSkyscanner(originAirport, destinationAirport, departureDate, returnDate);

function getUserInput() {
    originAirport = prompt('Enter origin airport code: ');
    destinationAirport = prompt('Enter destination airport code: ');

    departureDate = prompt('Enter departure date (dd.mm.yyyy): ');
    returnDate = prompt('Enter return date (dd.mm.yyyy): ');

    if (checkDate(departureDate) && checkDate(returnDate) && returnDate > departureDate) {
        console.log('\x1b[32m%s\x1b[0m', 'Origin: ' + originAirport + ' Destination: ' + destinationAirport + '\nDeparture: ' + departureDate + ' Return: ' + returnDate);
    } else {
        console.log('Invalid date!');
        process.exit();
    }
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

function searchSkyscanner(originAirport, destinationAirport, departureDate, returnDate) {
    console.log('searching Skyscanner...');
    departureDate = formatDate(departureDate);
    returnDate = formatDate(returnDate);

    puppeteer.use(StealthPlugin());
    puppeteer.use(AdBlockerPlugin({ blockTrackers: true }));

    puppeteer.launch({ headless: true }).then(async browser => {
        const page = await browser.newPage();
        await page.setViewport({ width: 800, height: 600 })

        //accept cookies
        await page.goto(skyscanner_url + originAirport + '/' + destinationAirport + '/' + departureDate + '/' + returnDate);
        await page.click('#acceptCookieButton');
        console.log('clicked accept cookie button');

        //wait for element to load and take screenshot
        await page.setDefaultNavigationTimeout(0);
        await page.waitForSelector('.SummaryInfo_itineraryCountContainer__NWFkN', { visible: true });

        console.log('fetching results...');
        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'screenshot2.png' });
        console.log('results loaded!');
        await browser.close()
    });
}