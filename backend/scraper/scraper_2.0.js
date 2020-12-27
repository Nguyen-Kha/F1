const puppeteer = require("puppeteer");
const scraper = require('./scraperModules.js');

async function scrape(){
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    const closeBracket = ')'

    // When clicking on a new page on a new tab, wait for the promise
    // const newPagePromise = new Promise(x => page.once('popup', x));

    // Testing on single page first
    await page.setDefaultNavigationTimeout(0);
    // await page.goto("https://www.f1-fansite.com/f1-results/2019-f1-championship-standings/");
    await page.goto("https://www.f1-fansite.com/f1-results/");

    let scrapedData = [];

    // Find navigation table and amount of rows in navigation table
    let navTableSelector = '.motor-sport-results > tbody';
    let navTableRows = await scraper.getchildElementCount(page, navTableSelector);

    // Iterate through all the rows, then find the amount of columns in the row
    // get year then change target attribute, then open in new tab
    for(let a = 1; a <= navTableRows; a++){
        let navRowSelector = ''
        const navRowSelectorMiddle = ' > tr:nth-child(';
        navRowSelector = navRowSelector.concat(navTableSelector, navRowSelectorMiddle, a, closeBracket);

        // Get amount of columns in row 
        let navTableColumns = await scraper.getchildElementCount(page, navRowSelector);

        // Check if there is innerText. If there is, open the link
        for(let b = 1; b <= navTableColumns; b++){
            navYearSelector = '';
            const navYearSelectorMiddle = ' > td:nth-child(';
            navYearSelector = navYearSelector.concat(navRowSelector, navYearSelectorMiddle, b, closeBracket);

            // Get innerText
            let year = await scraper.getinnerText(page, navYearSelector);
            yearCharLength = year.length;

            // Check if there is any inner text, if there is, work with it
            if(yearCharLength == 4){
                year = parseInt(year);

                // Add target="_blank" 
                navYearLinkSelector = '';
                const navYearLinkSelectorMiddle = ' > a';
                navYearLinkSelector = navYearLinkSelector.concat(navYearSelector, navYearLinkSelectorMiddle);
                await scraper.setAttributeValue(page, navYearLinkSelector, 'target', '_blank');

                // Open link in new tab
                const newPagePromise = new Promise(x => page.once('popup', x));
                await page.click(navYearLinkSelector);
                const newPage = await newPagePromise;   
                await newPage.waitFor(300); 

                // Add the bottom stuff here, change page to newPage

                // Close the new page
                await newPage.close();
                await page.bringToFront();
                await page.waitFor(100);
            }
            
        }
    }

    

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
     // Find the header and intialize it
     ////////////////////////////////   FUNCTION THIS GUY   ///////////////////////////////////
    let headerRowSelector = '.msr_season_driver_results > thead > tr';
    let headerColumns = await scraper.getchildElementCount(page, headerRowSelector);

    let headerKeyList = [];
    //  Find the element thead tr, then iterate through all the <th>s innerText
    for(let i = 1; i <= parseInt(headerColumns); i++){
        let tempHeaderRowSelector = ''
        const headerRowSelectorMiddle = ' > th:nth-child(';
        tempHeaderRowSelector = tempHeaderRowSelector.concat(headerRowSelector, headerRowSelectorMiddle, i, closeBracket);

        let headerValue = await scraper.getinnerText(page, tempHeaderRowSelector);  // added let
        headerKeyList.push(headerValue);
    }

    ////////////////////////////////   END OF FUNCTION   ///////////////////////////////////

    /*
        JSON FORMAT
        {
            year: yearNumber,
            driver: driverName,
            results:{
                race1: {
                    place: str(placeNumber),
                    points: pointNumber (title in the HTML)
                },
                race2: {
                    place: str(placeNumber),
                    points: pointNumber (title in the HTML)
                }
            },
            points: pointValue
        }
    */

    // Getting Race data for each driver in the year
    ////////////////////////////////   FUNCTION THIS GUY   ///////////////////////////////////
    
    
    // Find selectors for the rows
    /*
        RETURNS: bodyRows: int
    */
    let bodyRowSelector = '.msr_season_driver_results > tbody';

    let bodyRows = await scraper.getchildElementCount(page, bodyRowSelector);
    
    let allDriversList = [];
    // Go through all the driver rows
    for(let i = 1; i <= parseInt(bodyRows); i++){
        let driverYearObject = {};
        let driverResultsObject = {};

        driverYearObject.year = year;

        let tempRowSelector = '';
        const tempRowSelectorMiddle = ' > tr:nth-child(';
        tempRowSelector = tempRowSelector.concat(bodyRowSelector, tempRowSelectorMiddle, i, closeBracket);


        for(let j = 2; j <= parseInt(headerColumns); j++){
            let driverRaceObject = {};

            let driverStandSelector = '';
            const driverStandSelectorMiddle = ' > td:nth-child(';
            driverStandSelector = driverStandSelector.concat(tempRowSelector, driverStandSelectorMiddle, j, closeBracket);

            if(j == 2){
                let nameSelector = '';
                nameSelector = nameSelector.concat(driverStandSelector, ' > a:nth-child(2)');
                let nameValue = await scraper.getinnerText(page, nameSelector);
                driverYearObject.name = nameValue;
            }
            else if(j == parseInt(headerColumns)){
                let totalPointsValue = await scraper.getinnerText(page, driverStandSelector);
                driverYearObject.totalPoints = totalPointsValue;
            }
            else{ 
                // Get place and store to driverPlaceObject 
                let placeValue = await scraper.getinnerText(page, driverStandSelector);
                driverRaceObject.place = placeValue;

                // Get points and store to driverPointObject
                let pointValue = await scraper.getAttributeValue(page, driverStandSelector, 'title');
                driverRaceObject.points = pointValue;
                driverResultsObject[headerKeyList[j-1]] = driverRaceObject;
            }
        } 

        // Add driverResultsObject to driverYearObject
        driverYearObject.results = driverResultsObject;
        allDriversList.push(driverYearObject);
    }

    testArrayJSON = JSON.stringify(allDriversList);
    var fs = require('fs');
    fs.writeFile("test.json", testArrayJSON, function(err) {
        if (err) {
            console.log(err);
        }
    });
    browser.close();
}

scrape().catch(console.error);