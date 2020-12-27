const puppeteer = require("puppeteer");
const scraper = require('./scraperModules.js');

async function scrape(){
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    const closeBracket = ')'
    let allDriversList = [];

    await page.setDefaultNavigationTimeout(0);
    await page.goto("https://www.f1-fansite.com/f1-results/");

    // Find navigation table and amount of rows in navigation table
    let navTableSelector = '.motor-sport-results > tbody';
    let navTableRows = await scraper.getchildElementCount(page, navTableSelector);

    // Remove the share to socials div at the bottom of the page
    let bottomSocialSelector = '.st-sticky-share-buttons';
    await scraper.removeElement(page, bottomSocialSelector);

    for(let a = 1; a <= navTableRows; a++){
        // Find the individual rows
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
            console.log('Current year: ' + year);

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
                await newPage.setDefaultNavigationTimeout(0);

                 // Find the header and intialize it
                let headerRowSelector = '.msr_season_driver_results > thead > tr';
                let headerColumns = await scraper.getchildElementCount(newPage, headerRowSelector);

                let headerKeyList = [];

                // Remove the share to socials div at the bottom of the page
                await scraper.removeElement(newPage, bottomSocialSelector);

                //  Find the element thead tr, then iterate through all the <th>s innerText
                for(let i = 1; i <= parseInt(headerColumns); i++){
                    let tempHeaderRowSelector = ''
                    const headerRowSelectorMiddle = ' > th:nth-child(';
                    tempHeaderRowSelector = tempHeaderRowSelector.concat(headerRowSelector, headerRowSelectorMiddle, i, closeBracket);

                    let headerValue = await scraper.getinnerText(newPage, tempHeaderRowSelector);  // added let
                    headerKeyList.push(headerValue);
                }

                // Getting Race data for each driver in the year
                let bodyRowSelector = '.msr_season_driver_results > tbody';
                let bodyRows = await scraper.getchildElementCount(newPage, bodyRowSelector);
                
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
                        
                        try{
                            if(j == 2){
                                let nameSelector = '';
                                nameSelector = nameSelector.concat(driverStandSelector, ' > a:nth-child(2)');
                                let nameValue = await scraper.getinnerText(newPage, nameSelector);
                                driverYearObject.name = nameValue;
                            }
                            else if(j == parseInt(headerColumns)){
                                let totalPointsValue = await scraper.getinnerText(newPage, driverStandSelector);
                                driverYearObject.totalPoints = totalPointsValue;
                            }
                            else{ 
                                // Get place and store to driverPlaceObject 
                                let placeValue = await scraper.getinnerText(newPage, driverStandSelector);
                                driverRaceObject.place = placeValue;
    
                                // Get points and store to driverPointObject
                                let pointValue = await scraper.getAttributeValue(newPage, driverStandSelector, 'title');
                                driverRaceObject.points = pointValue;
                                driverResultsObject[headerKeyList[j-1]] = driverRaceObject;
                            }
                        }
                        catch(e){
                            console.log('year: ' + year);
                        }
                        
                    } 

                    // Add driverResultsObject to driverYearObject
                    driverYearObject.results = driverResultsObject;
                    allDriversList.push(driverYearObject);
                }

                // Close the new page
                await newPage.close();
                await page.bringToFront();
                await page.waitFor(100);
            }
            
        }
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