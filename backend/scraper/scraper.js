const puppeteer = require("puppeteer");
const pageURL = "www.google.com";

const webscraping = async pageURL => {
    const broswer = await puppeteer.launch({
        headless: false,
    });
    const page = await broswer.newPage();
    console.log("opened");
    broswer.close()
};
webscraping(pageURL).catch(console.error);