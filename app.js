const prompt = require('prompt-sync')();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');

const skyscanner_url = 'https://www.skyscanner.de/transport/fluge/';

let search = '';
let originAirportCode = '';
let destinationAirportCode = '';
let originAirportName = '';
let destinationAirportName = '';
let departureDate = '';
let returnDate = '';

getUserInput();
if (search == 1) {
    searchSkyscanner(originAirportCode, destinationAirportCode, departureDate, returnDate);
} else if (search == 2) {
    searchSkyscanner(originAirportName, destinationAirportName, departureDate, returnDate);
}

function getUserInput() {
    search = prompt('Press 1 for search with airport code, 2 for search with airport name: ');

    if (search == 1) {
        originAirportCode = prompt('Enter origin airport code: ');
        destinationAirportCode = prompt('Enter destination airport code: ');
    } else if (search == 2) {
        originAirportName = prompt('Enter irigin airport name: ');
        destinationAirportName = prompt('Enter destination airport name: ');
    } else {
        console.log('God is a woman');
    }

    departureDate = prompt('Enter departure date (dd.mm.yyyy): ');
    returnDate = prompt('Enter return date (dd.mm.yyyy): ');

    if (checkDate(departureDate) && checkDate(returnDate) && returnDate > departureDate) {
        if (search == 1) {
            console.log('\x1b[32m%s\x1b[0m', 'Origin: ' + originAirportCode + ' Destination: ' + destinationAirportCode + '\nDeparture: ' + departureDate + ' Return: ' + returnDate);
        } else if (search == 2) {
            console.log('\x1b[32m%s\x1b[0m', 'Origin: ' + originAirportName + ' Destination: ' + destinationAirportName + '\nDeparture: ' + departureDate + ' Return: ' + returnDate);
        }
    } else {
        console.log('Invalid date');
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

    console.log(skyscanner_url + originAirport + '/' + destinationAirport + '/' + departureDate + '/' + returnDate);
    puppeteer.launch({ headless: true }).then(async browser => {
        const page = await browser.newPage();
        await page.setViewport({ width: 800, height: 600 })

        //accept cookies
        await page.goto(skyscanner_url + originAirport + '/' + destinationAirport + '/' + departureDate + '/' + returnDate);
        await page.click('#acceptCookieButton');
        console.log('clicked accept cookie button');



        await browser.close()
    });
}